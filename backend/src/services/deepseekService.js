const axios = require('axios');

class DeepSeekService {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    console.log(`🤖 DeepSeek Service: ${this.apiKey ? 'API Key Configured ✅' : 'No API Key ❌'}`);
  }

  async generateSearchQueries(bookParams) {
    try {
      console.log('🤖 Generating search queries with DeepSeek...');
      
      // Use DeepSeek API if key is available
      if (this.apiKey && this.apiKey !== 'your_deepseek_api_key_here') {
        return await this.generateWithDeepSeek(bookParams);
      }
      
      // Fallback to local generation
      console.log('⚠️ No DeepSeek API key, using local generation');
      return this.localQueryGeneration(bookParams);
      
    } catch (error) {
      console.error('Query generation failed:', error.message);
      return this.fallbackQueries(bookParams);
    }
  }

  async generateWithDeepSeek(bookParams) {
    try {
      const prompt = `You are an academic research assistant. Generate 8 specific search queries for finding academic papers and research materials for a book with these details:

Book Title: "${bookParams.title}"
Main Topic: "${bookParams.topic}"
Author: ${bookParams.author || 'Not specified'}
Year: ${bookParams.year || 'Not specified'}
Keywords: ${bookParams.keywords || 'Not specified'}

Generate search queries that would work well with academic databases like arXiv, Semantic Scholar, Google Scholar, PubMed, etc. Include both broad and specific queries. Return ONLY a JSON array of search query strings.`;

      const response = await axios.post(
        this.apiUrl,
        {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are an expert academic research librarian.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const content = response.data.choices[0].message.content;
      
      // Parse JSON response
      try {
        const queries = JSON.parse(content);
        if (Array.isArray(queries) && queries.length > 0) {
          console.log(`✅ Generated ${queries.length} queries with DeepSeek`);
          return queries;
        }
      } catch (parseError) {
        console.log('Could not parse as JSON, extracting queries from text');
        // Extract queries from text response
        const queryMatches = content.match(/["']([^"']+)["']/g) || [];
        const queries = queryMatches.map(q => q.replace(/["']/g, '')).filter(q => q.length > 5);
        if (queries.length > 0) return queries;
      }
      
      throw new Error('No valid queries generated');
      
    } catch (error) {
      console.error('DeepSeek API error:', error.message);
      throw error;
    }
  }

  async analyzeAndExtractSnippets(researchContent, bookParams) {
    try {
      console.log('🤖 Analyzing content with DeepSeek...');
      
      // Use DeepSeek API if key is available
      if (this.apiKey && this.apiKey !== 'your_deepseek_api_key_here') {
        return await this.analyzeWithDeepSeek(researchContent, bookParams);
      }
      
      // Fallback to local analysis
      console.log('⚠️ No DeepSeek API key, using local analysis');
      return this.localContentAnalysis(researchContent, bookParams);
      
    } catch (error) {
      console.error('Analysis failed:', error.message);
      return this.fallbackAnalysis(researchContent, bookParams);
    }
  }

 async analyzeWithDeepSeek(researchContent, bookParams) {
    try {
      // Limit to first 5 papers for analysis (to avoid token limits)
      const papersToAnalyze = researchContent.slice(0, 5);
      
      console.log(`🤖 Sending ${papersToAnalyze.length} papers to DeepSeek for analysis...`);
      
      // Prepare paper summaries for the prompt
      const paperSummaries = papersToAnalyze.map((paper, index) => {
        return `Paper ${index + 1}:
- Title: ${paper.title || 'Untitled'}
- Source: ${paper.source || 'Unknown'}
- Year: ${paper.year || 'N/A'}
- Abstract/Content: ${paper.content ? paper.content.substring(0, 300) + '...' : 'No content available'}
- Authors: ${Array.isArray(paper.authors) ? paper.authors.slice(0, 3).join(', ') : 'Unknown'}`;
      }).join('\n\n');

      const prompt = `You are an expert academic researcher analyzing papers for a book about "${bookParams.topic}".

Book Details:
- Title: "${bookParams.title}"
- Main Topic: "${bookParams.topic}"
- Author: ${bookParams.author || 'Not specified'}

Please analyze these research papers and provide:
1. A concise, informative summary of each paper (2-3 sentences)
2. Relevance score (1-10) to the book topic "${bookParams.topic}"
3. 3-5 keywords for each paper
4. Brief reason for relevance

Papers to analyze:
${paperSummaries}

Return ONLY a JSON array with this exact structure for each paper:
[
  {
    "title": "Original paper title",
    "content": "Concise summary here",
    "relevanceScore": 7,
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "relevanceReason": "Brief explanation of relevance"
  }
]`;

      console.log('📤 Calling DeepSeek API...');
      
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are an expert academic researcher. Provide accurate, concise analysis of research papers. Return ONLY valid JSON.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000,
          temperature: 0.5,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 45000
        }
      );

      const content = response.data.choices[0].message.content;
      console.log('✅ DeepSeek response received');
      
      try {
        // Try to parse as JSON
        const parsedContent = JSON.parse(content);
        
        // Check if it's an array or has an array property
        let analyzedResults = [];
        if (Array.isArray(parsedContent)) {
          analyzedResults = parsedContent;
        } else if (parsedContent.papers && Array.isArray(parsedContent.papers)) {
          analyzedResults = parsedContent.papers;
        } else if (parsedContent.results && Array.isArray(parsedContent.results)) {
          analyzedResults = parsedContent.results;
        } else {
          // Try to find any array in the object
          for (const key in parsedContent) {
            if (Array.isArray(parsedContent[key])) {
              analyzedResults = parsedContent[key];
              break;
            }
          }
        }

        if (analyzedResults.length > 0) {
          console.log(`✅ DeepSeek analyzed ${analyzedResults.length} papers`);
          
          // Merge with original research content
          const enhancedResults = papersToAnalyze.map((original, index) => {
            const analyzed = analyzedResults[index] || {};
            
            // Use original content as fallback for analysis
            const originalContent = original.content || original.originalContent || '';
            const summary = analyzed.content || 
                           (originalContent.length > 200 ? originalContent.substring(0, 200) + '...' : originalContent);
            
            return {
              ...original,
              content: summary,
              relevanceScore: analyzed.relevanceScore || this.calculateLocalRelevance(original, bookParams),
              relevanceReason: analyzed.relevanceReason || this.getRelevanceReason(original, bookParams),
              keywords: analyzed.keywords || this.extractLocalKeywords(original, bookParams),
              extractionMethod: 'deepseek_ai_analysis',
              confidence: 0.9,
              isFree: original.isFree || true,
              isOpenAccess: original.isOpenAccess || true,
              freeAccessInfo: {
                accessType: 'Free',
                license: 'Open Access',
                notes: 'AI-enhanced analysis'
              },
              aiEnhanced: true
            };
          });

          // Add non-analyzed papers with local analysis
          const otherResults = researchContent.slice(5).map(paper => 
            this.localContentAnalysis([paper], bookParams)[0]
          );

          return [...enhancedResults, ...otherResults];
          
        } else {
          console.log('⚠️ DeepSeek returned empty results array');
          throw new Error('Empty analysis results');
        }
        
      } catch (parseError) {
        console.log('❌ Could not parse DeepSeek response as JSON:', parseError.message);
        console.log('Raw response:', content.substring(0, 200) + '...');
        
        // Extract structured data from text response
        const enhancedResults = this.extractAnalysisFromText(content, papersToAnalyze, bookParams);
        if (enhancedResults.length > 0) {
          return enhancedResults;
        }
        
        throw new Error('Could not parse analysis');
      }
      
    } catch (error) {
      console.error('❌ DeepSeek analysis error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  extractAnalysisFromText(text, papers, bookParams) {
    console.log('🔍 Attempting to extract analysis from text response...');
    
    const results = [];
    const lines = text.split('\n');
    
    for (let i = 0; i < papers.length; i++) {
      const paper = papers[i];
      let summary = '';
      let relevanceScore = this.calculateLocalRelevance(paper, bookParams);
      let keywords = this.extractLocalKeywords(paper, bookParams);
      
      // Try to find summary for this paper
      const titlePattern = new RegExp(`(?:\\.|\\d+\\.|\\*)\\s*${paper.title.substring(0, 50)}.*?\\n([^\\n]+(?:\\n[^\\n]+){0,2})`, 'i');
      const match = text.match(titlePattern);
      
      if (match && match[1]) {
        summary = match[1].trim();
      } else {
        // Fallback: use original content
        const originalContent = paper.content || paper.originalContent || '';
        summary = originalContent.length > 200 ? originalContent.substring(0, 200) + '...' : originalContent;
      }
      
      results.push({
        ...paper,
        content: summary,
        relevanceScore: relevanceScore,
        relevanceReason: this.getRelevanceReason(paper, bookParams),
        keywords: keywords,
        extractionMethod: 'text_extraction_analysis',
        confidence: 0.6,
        aiEnhanced: true
      });
    }
    
    return results;
  }

  // Keep the local fallback methods as backup
  localQueryGeneration(bookParams) {
    console.log('🔍 Generating queries locally...');
    
    const baseQueries = [
      `${bookParams.topic} research papers`,
      `${bookParams.topic} academic articles`,
      `${bookParams.title} related studies`,
      `${bookParams.topic} literature review`,
      `${bookParams.topic} recent developments`
    ];
    
    if (bookParams.author) {
      baseQueries.push(`${bookParams.author} ${bookParams.topic}`);
    }
    
    if (bookParams.keywords) {
      const keywords = bookParams.keywords.split(',').map(k => k.trim());
      keywords.forEach(keyword => {
        baseQueries.push(`${keyword} ${bookParams.topic}`);
        baseQueries.push(`${bookParams.topic} ${keyword} research`);
      });
    }
    
    // Add source-specific queries
    const specificQueries = [
      ...baseQueries.map(q => `${q} site:arxiv.org`),
      ...baseQueries.map(q => `${q} "Semantic Scholar"`),
      ...baseQueries.map(q => `${q} "OpenAlex"`),
      ...baseQueries.map(q => `${q} "Zenodo"`)
    ];
    
    return [...new Set([...baseQueries, ...specificQueries])].slice(0, 10);
  }

  localContentAnalysis(researchContent, bookParams) {
    console.log('🔬 Analyzing content locally...');
    
    return researchContent.map((paper, index) => {
      // Extract relevant sentences using simple NLP
      const sentences = (paper.content || '').split(/[.!?]+/);
      const relevantSentences = sentences.filter(sentence => {
        const lowerSentence = sentence.toLowerCase();
        const lowerTopic = bookParams.topic.toLowerCase();
        return lowerSentence.includes(lowerTopic) || 
               (bookParams.keywords && bookParams.keywords.split(',').some(kw => 
                 lowerSentence.includes(kw.trim().toLowerCase())
               ));
      });
      
      const snippet = relevantSentences.length > 0
        ? relevantSentences.slice(0, 2).join('. ') + '.'
        : this.generateRelevantSnippet(paper, bookParams);
      
      return {
        id: `local_${Date.now()}_${index}`,
        title: paper.title || `Research on ${bookParams.topic}`,
        content: snippet,
        originalContent: paper.content || paper.abstract || 'No content available',
        source: paper.source || 'Academic Database',
        authors: paper.authors || ['Various Researchers'],
        year: paper.year || new Date().getFullYear(),
        url: paper.url || '#',
        relevanceScore: this.calculateLocalRelevance(paper, bookParams),
        relevanceReason: this.getRelevanceReason(paper, bookParams),
        keywords: this.extractLocalKeywords(paper, bookParams),
        extractionMethod: 'local_nlp_analysis',
        confidence: 0.7,
        isFree: true,
        isOpenAccess: true,
        freeAccessInfo: {
          accessType: 'Free',
          license: 'Open Access',
          notes: 'Public academic repository'
        }
      };
    });
  }

  calculateLocalRelevance(paper, bookParams) {
    let score = 5;
    const text = (paper.title + ' ' + (paper.content || '')).toLowerCase();
    const topic = bookParams.topic.toLowerCase();
    
    if (text.includes(topic)) score += 3;
    
    if (bookParams.keywords) {
      const keywords = bookParams.keywords.toLowerCase().split(',');
      keywords.forEach(keyword => {
        if (text.includes(keyword.trim())) score += 1;
      });
    }
    
    if (paper.year && paper.year >= new Date().getFullYear() - 2) score += 2;
    
    return Math.min(10, Math.max(1, score));
  }

  generateRelevantSnippet(paper, bookParams) {
    return `This research paper discusses aspects relevant to ${bookParams.topic}. 
    Published in ${paper.source || 'academic database'} in ${paper.year || 'recent years'}.`;
  }

  getRelevanceReason(paper, bookParams) {
    const text = (paper.title || '').toLowerCase();
    const topic = bookParams.topic.toLowerCase();
    
    if (text.includes(topic)) {
      return `Title directly mentions "${bookParams.topic}"`;
    }
    
    return `Related to broader field of "${bookParams.topic}"`;
  }

  extractLocalKeywords(paper, bookParams) {
    const baseKeywords = [bookParams.topic, 'research', 'academic'];
    
    if (bookParams.keywords) {
      const additionalKeywords = bookParams.keywords.split(',').map(k => k.trim());
      baseKeywords.push(...additionalKeywords.slice(0, 3));
    }
    
    return [...new Set(baseKeywords)];
  }

  fallbackQueries(bookParams) {
    return [
      `${bookParams.topic} academic papers`,
      `${bookParams.topic} research articles`,
      `"${bookParams.title}" related research`
    ];
  }

  fallbackAnalysis(researchContent, bookParams) {
    return researchContent.map((paper, index) => ({
      id: `fallback_${Date.now()}_${index}`,
      title: paper.title || `Research on ${bookParams.topic}`,
      content: `Relevant research about ${bookParams.topic}.`,
      source: paper.source || 'Academic Source',
      authors: paper.authors || ['Researchers'],
      year: paper.year || new Date().getFullYear(),
      url: paper.url || '#',
      relevanceScore: 7 - (index % 3),
      keywords: [bookParams.topic, 'research'],
      isFree: true,
      isOpenAccess: true
    }));
  }
}

module.exports = DeepSeekService;
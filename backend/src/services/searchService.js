// const DeepSeekService = require('./deepseekService');
// const AcademicService = require('./academicService');

// class SearchService {
//   constructor() {
//     this.deepseekService = new DeepSeekService();
//     this.academicService = new AcademicService();
//     console.log('🔧 Search Service Initialized');
//     console.log(`🤖 DeepSeek API: ${this.deepseekService.apiKey ? 'Configured ✅' : 'Not Configured ❌'}`);
//   }

//   async searchResearchMaterials(bookParams) {
//     try {
//       console.log(`📚 Searching for: "${bookParams.title}" about "${bookParams.topic}"`);
      
//       // Step 1: Generate search queries with DeepSeek
//       const queries = await this.generateSearchQueries(bookParams);
//       console.log(`🔍 Using ${queries.length} search queries`);
      
//       // Step 2: Search public APIs
//       const searchPromises = queries.slice(0, 3).map(query =>
//         this.academicService.searchAllSources(query, 4)
//       );
      
//       const results = await Promise.allSettled(searchPromises);
//       const allResults = results
//         .filter(r => r.status === 'fulfilled')
//         .map(r => r.value)
//         .flat();
      
//       // Remove duplicates
//       const uniqueResults = this.removeDuplicates(allResults);
//       console.log(`✅ Found ${uniqueResults.length} unique results from public APIs`);
      
//       if (uniqueResults.length === 0) {
//         console.log('⚠️ No API results found, using mock data');
//         return this.generateEnhancedMockResults(bookParams);
//       }
      
//       // Step 3: Analyze and enhance results with DeepSeek
//       const enhancedResults = await this.enhanceWithDeepSeekAnalysis(uniqueResults, bookParams);
      
//       // Step 4: Sort and limit
//       const finalResults = enhancedResults
//         .sort((a, b) => b.relevanceScore - a.relevanceScore)
//         .slice(0, bookParams.maxResults || 15);
      
//       console.log(`🎉 Search completed: ${finalResults.length} enhanced results ready`);
//       return finalResults;
      
//     } catch (error) {
//       console.error('Search failed:', error.message);
//       return this.generateEnhancedMockResults(bookParams);
//     }
//   }

//   async generateSearchQueries(bookParams) {
//     try {
//       return await this.deepseekService.generateSearchQueries(bookParams);
//     } catch (error) {
//       console.warn('DeepSeek query generation failed:', error.message);
//       return this.localQueryGeneration(bookParams);
//     }
//   }

//  async enhanceWithDeepSeekAnalysis(results, bookParams) {
//     try {
//       console.log('🤖 Attempting to enhance results with DeepSeek analysis...');
      
//       if (!this.deepseekService.apiKey || this.deepseekService.apiKey === 'your_deepseek_api_key_here') {
//         console.log('⚠️ DeepSeek API key not configured, using local enhancement');
//         return this.enhanceWithLocalAnalysis(results, bookParams);
//       }
      
//       // Try DeepSeek analysis
//       const enhancedResults = await this.deepseekService.analyzeAndExtractSnippets(results, bookParams);
      
//       if (enhancedResults && enhancedResults.length > 0) {
//         console.log(`✅ Successfully enhanced ${enhancedResults.length} results with DeepSeek`);
//         return enhancedResults;
//       } else {
//         throw new Error('DeepSeek returned empty results');
//       }
      
//     } catch (error) {
//       console.warn('❌ DeepSeek analysis failed:', error.message);
//       console.log('🔄 Falling back to local enhancement...');
//       return this.enhanceWithLocalAnalysis(results, bookParams);
//     }
//   }

//   enhanceWithLocalAnalysis(results, bookParams) {
//     console.log('🔬 Enhancing results with local analysis...');
    
//     return results.map((result, index) => {
//       const originalContent = result.content || result.originalContent || '';
      
//       // Create better summaries from original content
//       let content = '';
//       if (originalContent.length > 50) {
//         // Extract first meaningful sentences
//         const sentences = originalContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
//         content = sentences.slice(0, 2).join('. ') + '.';
//       } else {
//         content = `Research from ${result.source} discussing ${bookParams.topic}. Published in ${result.year || 'recent years'}.`;
//       }
      
//       const relevanceScore = this.calculateRelevance(result, bookParams);
//       const keywords = this.extractKeywords(result, bookParams);
//       const accessInfo = this.determineAccessInfo(result);
      
//       return {
//         ...result,
//         content: content,
//         relevanceScore: relevanceScore,
//         relevanceReason: this.getRelevanceReason(result, bookParams),
//         keywords: keywords,
//         extractionMethod: 'local_analysis',
//         confidence: 0.7,
//         isFree: true,
//         isOpenAccess: result.isOpenAccess || false,
//         freeAccessInfo: accessInfo,
//         openScienceScore: this.calculateOpenScienceScore(result),
//         accessibility: {
//           level: result.isOpenAccess ? 'High' : 'Medium',
//           factors: this.getAccessibilityFactors(result)
//         },
//         actionableInsights: this.generateActionableInsights(result, bookParams),
//         costSavings: this.calculateCostSavings(result),
//         timestamp: new Date().toISOString()
//       };
//     });
//   }

//   // Keep the existing local methods as fallbacks
//   localQueryGeneration(bookParams) {
//     const queries = [
//       `${bookParams.topic} research papers`,
//       `${bookParams.topic} academic articles`,
//       `"${bookParams.title}" related studies`,
//       `${bookParams.topic} literature review`,
      
//       // Source-specific queries
//       `${bookParams.topic} site:arxiv.org`,
//       `${bookParams.topic} "Semantic Scholar"`,
//       `${bookParams.topic} "OpenAlex"`,
      
//       // Author-specific if available
//       ...(bookParams.author ? [
//         `${bookParams.author} ${bookParams.topic}`,
//         `${bookParams.author} research papers`
//       ] : []),
//     ];
    
//     return [...new Set(queries)].slice(0, 8);
//   }

//   enhanceWithLocalAnalysis(results, bookParams) {
//     console.log('🔬 Enhancing results with local analysis...');
    
//     return results.map((result, index) => {
//       const relevanceScore = this.calculateRelevance(result, bookParams);
//       const keywords = this.extractKeywords(result, bookParams);
//       const accessInfo = this.determineAccessInfo(result);
      
//       return {
//         ...result,
//         relevanceScore: relevanceScore,
//         relevanceReason: this.getRelevanceReason(result, bookParams),
//         keywords: keywords,
//         extractionMethod: 'local_analysis',
//         confidence: 0.7,
//         isFree: true,
//         isOpenAccess: result.isOpenAccess || false,
//         freeAccessInfo: accessInfo,
//         openScienceScore: this.calculateOpenScienceScore(result),
//         accessibility: {
//           level: result.isOpenAccess ? 'High' : 'Medium',
//           factors: this.getAccessibilityFactors(result)
//         },
//         actionableInsights: this.generateActionableInsights(result, bookParams),
//         costSavings: this.calculateCostSavings(result),
//         timestamp: new Date().toISOString()
//       };
//     });
//   }

//   generateEnhancedMockResults(bookParams) {
//     console.log('🎨 Generating enhanced mock results');
    
//     const sources = [
//       { name: 'arXiv', type: 'preprint' },
//       { name: 'Semantic Scholar', type: 'journal' },
//       { name: 'OpenAlex', type: 'academic' },
//       { name: 'PubMed', type: 'medical' },
//       { name: 'Google Scholar', type: 'general' }
//     ];
    
//     const maxResults = bookParams.maxResults || 10;
    
//     return Array.from({ length: maxResults }, (_, i) => {
//       const source = sources[i % sources.length];
//       const year = new Date().getFullYear() - Math.floor(Math.random() * 3);
//       const isHighlighted = i < 3;
      
//       return {
//         id: `enhanced_${Date.now()}_${i}`,
//         title: isHighlighted 
//           ? `"${bookParams.topic}": Recent Research Findings` 
//           : `Study on ${bookParams.topic} - ${source.name} ${i + 1}`,
//         content: isHighlighted
//           ? `Recent ${source.type} research from ${source.name} provides significant insights into "${bookParams.topic}". The study examines key aspects and presents novel findings relevant to current discussions in the field.`
//           : `This ${source.type} paper explores various dimensions of ${bookParams.topic}. Published in ${year}, it contributes to the ongoing academic discourse with empirical data and analysis.`,
//         originalContent: `Complete research article available through ${source.name}. This comprehensive study addresses multiple facets of ${bookParams.topic} with detailed methodology, results, and discussion sections.`,
//         source: source.name,
//         sourceType: source.type,
//         authors: [`Lead Researcher ${String.fromCharCode(65 + i)}`, 'Collaborative Research Team'],
//         year: year,
//         url: `https://${source.name.toLowerCase().replace(' ', '')}.org/doi/${Date.now()}_${i}`,
//         relevanceScore: 9 - Math.floor(i/2),
//         isFree: true,
//         isOpenAccess: true,
//         license: 'Creative Commons Attribution 4.0',
//         freeAccessInfo: {
//           accessType: 'Free',
//           license: 'Open Access',
//           notes: `Available via ${source.name} public repository`,
//           recommendedAction: `Download full text from ${source.name}`
//         },
//         openScienceScore: 75 + Math.floor(Math.random() * 20),
//         accessibility: {
//           level: 'High',
//           factors: ['Open Access', 'Public Repository', 'Free Download']
//         },
//         actionableInsights: [
//           'Open access publication',
//           'Recent research findings',
//           'Directly relevant to topic'
//         ],
//         isMock: true,
//         note: 'Enhanced mock data - configure API for real results',
//         costSavings: 90,
//         extractionMethod: 'mock_generation',
//         confidence: 0.6,
//         timestamp: new Date().toISOString()
//       };
//     });
//   }

//   // Keep all the existing helper methods (calculateRelevance, extractKeywords, etc.)
//   calculateRelevance(result, bookParams) {
//     let score = 5;
//     const text = (result.title + ' ' + (result.content || '')).toLowerCase();
//     const topic = bookParams.topic.toLowerCase();
    
//     if (result.title.toLowerCase().includes(topic)) score += 3;
//     if (text.includes(topic)) score += 2;
    
//     if (bookParams.keywords) {
//       const keywords = bookParams.keywords.toLowerCase().split(',');
//       keywords.forEach(keyword => {
//         if (text.includes(keyword.trim())) score += 1;
//       });
//     }
    
//     if (result.year && result.year >= new Date().getFullYear() - 2) score += 2;
    
//     const credibleSources = ['arXiv', 'Semantic Scholar', 'CrossRef', 'DOAJ'];
//     if (credibleSources.includes(result.source)) score += 1;
    
//     return Math.min(10, Math.max(1, score));
//   }

//   extractKeywords(result, bookParams) {
//     const baseKeywords = [bookParams.topic, 'research', 'academic'];
    
//     if (bookParams.keywords) {
//       const bookKeywords = bookParams.keywords.split(',').map(k => k.trim());
//       baseKeywords.push(...bookKeywords.slice(0, 3));
//     }
    
//     const titleWords = result.title.toLowerCase().split(/\W+/);
//     const significantWords = titleWords.filter(word => 
//       word.length > 4 && !this.isCommonWord(word)
//     ).slice(0, 3);
    
//     return [...new Set([...baseKeywords, ...significantWords])].slice(0, 8);
//   }

//   isCommonWord(word) {
//     const commonWords = ['research', 'study', 'paper', 'article', 'review', 'analysis'];
//     return commonWords.includes(word);
//   }

//   determineAccessInfo(result) {
//     const info = {
//       accessType: 'Free',
//       restrictions: 'None',
//       license: 'Open Access',
//       downloadAvailable: !!result.pdfLink || !!result.downloadUrl
//     };
    
//     if (result.source === 'arXiv') {
//       info.notes = 'Preprint server - free immediate access';
//       info.recommendedAction = 'Download PDF directly from arXiv';
//     } else if (result.source === 'DOAJ') {
//       info.notes = 'Directory of Open Access Journals';
//       info.recommendedAction = 'Full text available via journal';
//     } else if (result.source === 'Zenodo') {
//       info.notes = 'Research data repository';
//       info.recommendedAction = 'Access multiple formats including data';
//     }
    
//     return info;
//   }

//   calculateOpenScienceScore(result) {
//     let score = 50;
    
//     if (result.isOpenAccess) score += 20;
//     if (result.license && result.license.includes('creativecommons')) score += 15;
//     if (result.source === 'arXiv' || result.source === 'Zenodo') score += 10;
//     if (result.pdfLink || result.downloadUrl) score += 5;
//     if (result.doi) score += 5;
    
//     return Math.min(100, score);
//   }

//   getAccessibilityFactors(result) {
//     const factors = [];
    
//     if (result.isOpenAccess) factors.push('Open Access');
//     if (result.pdfLink) factors.push('PDF Available');
//     if (result.license) factors.push('Standard License');
//     if (result.doi) factors.push('DOI Available');
    
//     return factors.length > 0 ? factors : ['Public API Access'];
//   }

//   generateActionableInsights(result, bookParams) {
//     const insights = [];
    
//     if (result.relevanceScore >= 8) {
//       insights.push('Highly relevant to your book topic');
//     }
    
//     if (result.citationCount > 100) {
//       insights.push('Highly cited research');
//     }
    
//     if (result.year && result.year >= new Date().getFullYear() - 1) {
//       insights.push('Recent publication');
//     }
    
//     if (result.isOpenAccess) {
//       insights.push('Open access - freely available');
//     }
    
//     if (result.source === 'arXiv') {
//       insights.push('Preprint - latest research');
//     }
    
//     return insights;
//   }

//   calculateCostSavings(result) {
//     let savings = 0;
    
//     if (result.isOpenAccess) savings += 30;
//     if (result.pdfLink) savings += 40;
//     if (result.source !== 'mock') savings += 20;
    
//     return savings;
//   }

//   getRelevanceReason(result, bookParams) {
//     const text = result.title.toLowerCase();
//     const topic = bookParams.topic.toLowerCase();
    
//     if (text.includes(topic)) {
//       return `Title directly mentions "${bookParams.topic}"`;
//     }
    
//     return `Related content from ${result.source}`;
//   }

//   removeDuplicates(results) {
//     const seen = new Set();
//     return results.filter(result => {
//       const key = `${result.title}_${result.url}`.toLowerCase();
//       if (seen.has(key)) return false;
//       seen.add(key);
//       return true;
//     });
//   }
// }

// module.exports = SearchService;

const DeepSeekService = require('./deepseekService');
const AcademicService = require('./academicService');

class SearchService {
  constructor() {
    this.deepseekService = new DeepSeekService();
    this.academicService = new AcademicService();
    console.log('🔧 Enhanced Search Service Initialized');
  }

  async searchResearchMaterials(bookParams) {
    try {
      console.log(`📚 Comprehensive search for: "${bookParams.title}"`);
      console.log(`📖 Topic: "${bookParams.topic}"`);
      console.log(`👤 Author: ${bookParams.author || 'Not specified'}`);
      
      // Step 1: Generate comprehensive search queries
      const queries = await this.generateComprehensiveQueries(bookParams);
      console.log(`🔍 Using ${queries.length} search queries`);
      
      // Step 2: Search all platforms with each query
      const allResults = [];
      
      for (let i = 0; i < Math.min(queries.length, 3); i++) {
        const query = queries[i];
        console.log(`🔍 Searching for: "${query}"`);
        
        const results = await this.academicService.searchAllSources(query, 10);
        allResults.push(...results);
        
        // Add small delay between queries
        if (i < queries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // Step 3: Remove duplicates and filter
      const uniqueResults = this.filterAndDeduplicate(allResults, bookParams);
      console.log(`✅ Found ${uniqueResults.length} unique relevant results`);
      
      if (uniqueResults.length === 0) {
        console.log('⚠️ No relevant results found, generating comprehensive mock data');
        return this.generateComprehensiveMockResults(bookParams);
      }
      
      // Step 4: Categorize results by source
      const categorizedResults = this.categorizeResults(uniqueResults);
      
      // Step 5: Enhance with DeepSeek analysis if available
      const enhancedResults = await this.enhanceWithComprehensiveAnalysis(uniqueResults, bookParams);
      
      // Step 6: Sort, score, and format
      const finalResults = this.prepareFinalResults(enhancedResults, bookParams);
      
      console.log(`🎉 Search completed: ${finalResults.length} comprehensive results ready`);
      return finalResults;
      
    } catch (error) {
      console.error('Search failed:', error.message);
      return this.generateComprehensiveMockResults(bookParams);
    }
  }

  async generateComprehensiveQueries(bookParams) {
    try {
      const baseQueries = [
        bookParams.topic,
        `"${bookParams.topic}" research`,
        `${bookParams.topic} study`,
        `recent ${bookParams.topic} research`,
        `${bookParams.topic} literature review`,
        `${bookParams.topic} 2024`,
        `${bookParams.topic} academic papers`
      ];
      
      if (bookParams.author) {
        baseQueries.push(`${bookParams.author} ${bookParams.topic}`);
        baseQueries.push(`"${bookParams.author}" ${bookParams.topic}`);
      }
      
      if (bookParams.keywords) {
        const keywords = bookParams.keywords.split(',').map(k => k.trim());
        keywords.forEach(keyword => {
          baseQueries.push(`${bookParams.topic} ${keyword}`);
          baseQueries.push(`${keyword} research`);
        });
      }
      
      // Add source-specific queries
      const sourceQueries = baseQueries.flatMap(query => [
        `${query} site:arxiv.org`,
        `${query} "OpenAlex"`,
        `${query} "CrossRef"`,
        `${query} "Semantic Scholar"`,
        `${query} "Zenodo"`,
        `${query} "DOAJ"`
      ]);
      
      const allQueries = [...new Set([...baseQueries, ...sourceQueries])];
      return allQueries.slice(0, 10);
      
    } catch (error) {
      console.warn('Query generation failed:', error.message);
      return [bookParams.topic, `"${bookParams.topic}" research`];
    }
  }

  filterAndDeduplicate(results, bookParams) {
    const seen = new Map();
    const filtered = [];
    
    for (const result of results) {
      // Skip if no title
      if (!result.title || result.title.length < 10) continue;
      
      // Skip if year is too old (unless specifically requested)
      const currentYear = new Date().getFullYear();
      if (result.year && (currentYear - result.year) > 10 && !bookParams.includeHistorical) {
        continue;
      }
      
      // Create unique key
      const key = `${result.title.toLowerCase()}_${result.source}`;
      
      // Keep the most recent version
      if (!seen.has(key) || (result.year && result.year > seen.get(key).year)) {
        seen.set(key, result);
      }
    }
    
    // Calculate relevance scores
    return Array.from(seen.values()).map(result => ({
      ...result,
      relevanceScore: this.calculateComprehensiveRelevance(result, bookParams)
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  calculateComprehensiveRelevance(result, bookParams) {
    let score = 5;
    const text = (result.title + ' ' + (result.content || '') + ' ' + (result.originalContent || '')).toLowerCase();
    const topic = bookParams.topic.toLowerCase();
    const title = result.title.toLowerCase();
    
    // Title relevance
    if (title.includes(topic)) score += 4;
    if (title.includes(bookParams.title.toLowerCase())) score += 3;
    
    // Content relevance
    if (text.includes(topic)) score += 2;
    
    // Author relevance
    if (bookParams.author && result.authors) {
      const authors = result.authors.join(' ').toLowerCase();
      if (authors.includes(bookParams.author.toLowerCase())) score += 3;
    }
    
    // Recency
    if (result.year) {
      const currentYear = new Date().getFullYear();
      const age = currentYear - result.year;
      if (age <= 2) score += 3;
      else if (age <= 5) score += 2;
      else if (age <= 10) score += 1;
    }
    
    // Source quality
    const sourceScores = {
      'OpenAlex': 2,
      'CrossRef': 2,
      'Semantic Scholar': 2,
      'arXiv': 1,
      'Zenodo': 1,
      'DOAJ': 2
    };
    score += sourceScores[result.source] || 0;
    
    // Open Access bonus
    if (result.isOpenAccess) score += 1;
    
    // Citation impact
    if (result.citationCount > 100) score += 2;
    else if (result.citationCount > 50) score += 1;
    
    return Math.min(10, Math.max(1, score));
  }

  categorizeResults(results) {
    const categories = {
      openAccess: [],
      recent: [],
      highlyCited: [],
      reviews: [],
      dataSets: [],
      preprints: []
    };
    
    const currentYear = new Date().getFullYear();
    
    results.forEach(result => {
      // Open Access
      if (result.isOpenAccess) categories.openAccess.push(result);
      
      // Recent (last 2 years)
      if (result.year && (currentYear - result.year) <= 2) categories.recent.push(result);
      
      // Highly cited
      if (result.citationCount > 50) categories.highlyCited.push(result);
      
      // Reviews
      if (result.title.toLowerCase().includes('review') || 
          result.title.toLowerCase().includes('survey')) {
        categories.reviews.push(result);
      }
      
      // Datasets
      if (result.sourceType === 'dataset') categories.dataSets.push(result);
      
      // Preprints
      if (result.source === 'arXiv') categories.preprints.push(result);
    });
    
    return categories;
  }

  async enhanceWithComprehensiveAnalysis(results, bookParams) {
    try {
      console.log('🤖 Attempting comprehensive analysis...');
      
      if (this.deepseekService.apiKey && 
          this.deepseekService.apiKey !== 'your_deepseek_api_key_here' &&
          results.length > 0) {
        
        console.log('Using DeepSeek for comprehensive analysis...');
        const enhanced = await this.deepseekService.analyzeWithDeepSeek(results.slice(0, 5), bookParams);
        
        if (enhanced && enhanced.length > 0) {
          // Merge with remaining results
          const remaining = results.slice(5).map(r => 
            this.enhanceWithLocalAnalysis([r], bookParams)[0]
          );
          return [...enhanced, ...remaining];
        }
      }
      
      console.log('Using local comprehensive analysis...');
      return this.enhanceWithLocalComprehensiveAnalysis(results, bookParams);
      
    } catch (error) {
      console.warn('Comprehensive analysis failed:', error.message);
      return this.enhanceWithLocalComprehensiveAnalysis(results, bookParams);
    }
  }

  enhanceWithLocalComprehensiveAnalysis(results, bookParams) {
    return results.map((result, index) => {
      // Create comprehensive content
      let content = result.content || result.originalContent || '';
      
      if (content.length < 100 || content.includes('Relevant research about')) {
        // Generate better content
        content = this.generateComprehensiveContent(result, bookParams);
      }
      
      // Extract key insights
      const keyInsights = this.extractKeyInsights(result);
      
      // Generate practical applications
      const applications = this.generateApplications(result, bookParams);
      
      return {
        ...result,
        content: content.substring(0, 300) + (content.length > 300 ? '...' : ''),
        originalContent: result.originalContent || content,
        keyInsights: keyInsights,
        practicalApplications: applications,
        relevanceReason: this.getComprehensiveRelevanceReason(result, bookParams),
        keywords: this.extractComprehensiveKeywords(result, bookParams),
        extractionMethod: 'comprehensive_local_analysis',
        confidence: 0.8,
        accessibility: this.getAccessibilityInfo(result),
        costSavings: result.isOpenAccess ? 100 : 0,
        timestamp: new Date().toISOString(),
        searchMetadata: {
          originalQuery: bookParams.topic,
          processedAt: new Date().toISOString(),
          enhancementLevel: 'comprehensive'
        }
      };
    });
  }

  generateComprehensiveContent(result, bookParams) {
    const elements = [];
    
    // Source and type
    elements.push(`This ${result.sourceType || 'research'} from ${result.source}`);
    
    // Year
    if (result.year) elements.push(`published in ${result.year}`);
    
    // Authors
    if (result.authors && result.authors.length > 0) {
      const authors = result.authors.slice(0, 3).join(', ');
      elements.push(`by ${authors}`);
    }
    
    // Content focus
    elements.push(`explores "${bookParams.topic}"`);
    
    // Methodology hint if available
    if (result.sourceType === 'dataset') {
      elements.push('providing research data');
    } else if (result.source === 'arXiv') {
      elements.push('as a preprint');
    } else if (result.isOpenAccess) {
      elements.push('available as open access');
    }
    
    return elements.join(' ') + '. ' + 
           `It contributes to the academic discourse on ${bookParams.topic} with ` +
           `${result.citationCount ? `${result.citationCount} citations` : 'relevant findings'}.`;
  }

  extractKeyInsights(result) {
    const insights = [];
    const content = (result.originalContent || result.content || '').toLowerCase();
    
    // Look for common insight patterns
    if (content.includes('found that')) insights.push('Empirical findings');
    if (content.includes('conclude') || content.includes('suggest')) insights.push('Conclusions drawn');
    if (content.includes('method') || content.includes('approach')) insights.push('Methodological approach');
    if (content.includes('significantly') || content.includes('impact')) insights.push('Significant impacts');
    if (content.includes('limitation') || content.includes('future research')) insights.push('Research limitations');
    
    // Add source-specific insights
    if (result.source === 'arXiv') insights.push('Preprint availability');
    if (result.isOpenAccess) insights.push('Open access');
    if (result.citationCount > 50) insights.push('Highly cited');
    
    return insights.length > 0 ? insights : ['Academic research contribution'];
  }

  generateApplications(result, bookParams) {
    const applications = [];
    
    applications.push('Academic reference');
    
    if (result.sourceType === 'review' || result.title.toLowerCase().includes('review')) {
      applications.push('Literature review foundation');
    }
    
    if (result.year && (new Date().getFullYear() - result.year) <= 2) {
      applications.push('Current research context');
    }
    
    if (result.isOpenAccess) {
      applications.push('Freely citable material');
    }
    
    if (result.source === 'dataset' || result.sourceType === 'dataset') {
      applications.push('Data source');
    }
    
    return applications;
  }

  getComprehensiveRelevanceReason(result, bookParams) {
    const reasons = [];
    
    if (result.title.toLowerCase().includes(bookParams.topic.toLowerCase())) {
      reasons.push('Direct topic match in title');
    }
    
    if (result.authors && bookParams.author && 
        result.authors.some(a => a.toLowerCase().includes(bookParams.author.toLowerCase()))) {
      reasons.push('Author relevance');
    }
    
    if (result.year && (new Date().getFullYear() - result.year) <= 2) {
      reasons.push('Recent publication');
    }
    
    if (result.citationCount > 50) {
      reasons.push('Highly cited work');
    }
    
    if (result.isOpenAccess) {
      reasons.push('Open access availability');
    }
    
    return reasons.length > 0 ? reasons.join('; ') : 'Related academic research';
  }

  extractComprehensiveKeywords(result, bookParams) {
    const keywords = new Set();
    
    // Add topic
    keywords.add(bookParams.topic);
    
    // Add source type
    if (result.sourceType) keywords.add(result.sourceType.replace('_', ' '));
    
    // Add year if recent
    if (result.year && (new Date().getFullYear() - result.year) <= 5) {
      keywords.add(result.year.toString());
    }
    
    // Add from title (excluding common words)
    const titleWords = (result.title || '').toLowerCase().split(/\W+/);
    titleWords.forEach(word => {
      if (word.length > 4 && !this.isCommonWord(word)) {
        keywords.add(word);
      }
    });
    
    // Add access type
    if (result.isOpenAccess) keywords.add('open access');
    
    // Limit to 8 keywords
    return Array.from(keywords).slice(0, 8);
  }

  getAccessibilityInfo(result) {
    return {
      level: result.isOpenAccess ? 'High' : 'Medium',
      accessType: result.isOpenAccess ? 'Free' : 'May require subscription',
      pdfAvailable: !!result.pdfLink,
      doiAvailable: !!result.doi,
      license: result.license || 'Unknown',
      recommendedAction: result.isOpenAccess ? 
        'Download directly from source' : 
        'Check institutional access'
    };
  }

  prepareFinalResults(results, bookParams) {
    return results
      .map(result => ({
        ...result,
        relevanceScore: this.calculateComprehensiveRelevance(result, bookParams)
      }))
      .sort((a, b) => {
        // Primary sort by relevance
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        // Secondary sort by recency
        if (b.year !== a.year) {
          return (b.year || 0) - (a.year || 0);
        }
        // Tertiary sort by citation count
        return (b.citationCount || 0) - (a.citationCount || 0);
      })
      .slice(0, bookParams.maxResults || 20);
  }

  generateComprehensiveMockResults(bookParams) {
    console.log('🎨 Generating comprehensive mock results');
    
    const sources = [
      { name: 'OpenAlex', type: 'journal_article' },
      { name: 'CrossRef', type: 'journal_article' },
      { name: 'Semantic Scholar', type: 'conference_paper' },
      { name: 'Zenodo', type: 'dataset' },
      { name: 'arXiv', type: 'preprint' },
      { name: 'DOAJ', type: 'open_access_journal' }
    ];
    
    const maxResults = bookParams.maxResults || 15;
    const currentYear = new Date().getFullYear();
    
    return Array.from({ length: maxResults }, (_, i) => {
      const source = sources[i % sources.length];
      const year = currentYear - Math.floor(Math.random() * 3);
      const isRecent = (currentYear - year) <= 2;
      const isOpenAccess = Math.random() > 0.3;
      
      const abstract = `This comprehensive ${source.type} investigates "${bookParams.topic}" through ` +
        `${['a systematic review', 'empirical analysis', 'case studies', 'mixed-methods research'][i % 4]}. ` +
        `Published in ${source.name} in ${year}, the research provides ${isRecent ? 'current' : 'historical'} ` +
        `insights into ${bookParams.topic}. Key findings address ${['theoretical frameworks', 'practical applications', 'policy implications', 'future research directions'][i % 4]}.`;
      
      return {
        id: `comprehensive_${Date.now()}_${i}`,
        title: `"${bookParams.topic}": ${['Comprehensive Analysis', 'Critical Review', 'Novel Investigation', 'Systematic Study'][i % 4]} from ${source.name}`,
        content: abstract.substring(0, 250) + '...',
        originalContent: abstract,
        source: source.name,
        sourceType: source.type,
        authors: [
          `Dr. ${['Smith', 'Johnson', 'Williams'][i % 3]} ${String.fromCharCode(65 + (i % 26))}.`,
          `Prof. ${['Brown', 'Jones', 'Miller'][i % 3]}`
        ],
        year: year,
        url: `https://${source.name.toLowerCase().replace(' ', '')}.org/doi/10.1000/mock${i}`,
        doi: `10.1000/mock${i}`,
        citationCount: Math.floor(Math.random() * 200),
        keywords: [
          bookParams.topic,
          source.type.replace('_', ' '),
          year.toString(),
          'research',
          'academic',
          ...(isOpenAccess ? ['open access'] : []),
          ...(isRecent ? ['recent'] : [])
        ],
        isOpenAccess: isOpenAccess,
        isFree: isOpenAccess,
        pdfLink: isOpenAccess ? `https://${source.name.toLowerCase().replace(' ', '')}.org/pdf/mock${i}.pdf` : null,
        license: isOpenAccess ? 'CC BY 4.0' : 'Copyright',
        relevanceScore: 9 - Math.floor(i / 3),
        keyInsights: [
          'Methodological approach',
          'Key findings',
          'Research implications',
          isOpenAccess ? 'Open access availability' : 'Copyright restrictions'
        ],
        practicalApplications: [
          'Academic reference',
          'Literature review',
          'Research foundation'
        ],
        accessibility: {
          level: isOpenAccess ? 'High' : 'Medium',
          accessType: isOpenAccess ? 'Free' : 'Subscription required',
          pdfAvailable: isOpenAccess,
          doiAvailable: true
        },
        costSavings: isOpenAccess ? 100 : 0,
        isMock: true,
        note: `Real comprehensive data available from ${source.name} API`,
        extractionMethod: 'comprehensive_mock_generation',
        confidence: 0.7,
        timestamp: new Date().toISOString()
      };
    });
  }

  isCommonWord(word) {
    const commonWords = ['research', 'study', 'paper', 'article', 'review', 'analysis', 'journal'];
    return commonWords.includes(word.toLowerCase());
  }
}

module.exports = SearchService;
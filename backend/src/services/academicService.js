// const axios = require('axios');

// class AcademicService {
//   constructor() {
//     // PUBLIC APIS - NO KEYS REQUIRED
//     this.publicApis = {
//       // arXiv API - No key, no rate limits (within reason)
//       arXiv: {
//         baseUrl: 'http://export.arxiv.org/api/query',
//         method: 'GET',
//         params: (query, limit) => ({
//           search_query: `all:${encodeURIComponent(query)}`,
//           start: 0,
//           max_results: limit || 10,
//           sortBy: 'relevance',
//           sortOrder: 'descending'
//         })
//       },
      
//       // Semantic Scholar API - Public, no key
//       SemanticScholar: {
//         baseUrl: 'https://api.semanticscholar.org/graph/v1/paper/search',
//         method: 'GET',
//         params: (query, limit) => ({
//           query: query,
//           limit: limit || 10,
//           fields: 'title,authors,year,abstract,url,citationCount,venue'
//         })
//       },
      
//       // OpenAlex API - Public, no key
//       OpenAlex: {
//         baseUrl: 'https://api.openalex.org/works',
//         method: 'GET',
//         params: (query, limit) => ({
//           search: query,
//           per_page: limit || 10
//         })
//       },
      
//       // CrossRef API - Public, email recommended but not required
//       CrossRef: {
//         baseUrl: 'https://api.crossref.org/works',
//         method: 'GET',
//         params: (query, limit) => ({
//           query: query,
//           rows: limit || 10,
//           select: 'title,author,abstract,DOI,created,URL,license'
//         }),
//         headers: {
//           'User-Agent': 'BookResearchAssistant/1.0 (mailto:example@example.com)'
//         }
//       },
      
//       // DOAJ API - Public, no key
//       DOAJ: {
//         baseUrl: 'https://doaj.org/api/v2/search/articles',
//         method: 'GET',
//         params: (query, limit) => ({
//           q: query,
//           pageSize: limit || 10
//         })
//       },
      
//       // Zenodo API - Public, no key
//       Zenodo: {
//         baseUrl: 'https://zenodo.org/api/records',
//         method: 'GET',
//         params: (query, limit) => ({
//           q: query,
//           size: limit || 10,
//           sort: 'bestmatch'
//         })
//       },
      
//       // CORE API - Public, no key for basic
//       CORE: {
//         baseUrl: 'https://core.ac.uk/api-v2/search',
//         method: 'GET',
//         params: (query, limit) => ({
//           q: query,
//           pageSize: limit || 10
//         })
//       }
//     };
//   }

//   async searchAllSources(query, limit = 5) {
//     console.log(`🔍 Searching public APIs for: "${query}"`);
    
//     const searchPromises = Object.entries(this.publicApis).map(([name, api]) =>
//       this.searchSingleApi(name, api, query, Math.ceil(limit / 3))
//     );
    
//     try {
//       const results = await Promise.allSettled(searchPromises);
//       const successfulResults = results
//         .filter(r => r.status === 'fulfilled' && r.value.length > 0)
//         .map(r => r.value)
//         .flat();
      
//       console.log(`✅ Found ${successfulResults.length} results from public APIs`);
//       return successfulResults.slice(0, limit * 2);
      
//     } catch (error) {
//       console.error('Public API search failed:', error.message);
//       return this.generateMockResults(query, limit);
//     }
//   }

//   async searchSingleApi(apiName, apiConfig, query, limit) {
//     try {
//       const config = {
//         method: apiConfig.method,
//         url: apiConfig.baseUrl,
//         params: apiConfig.params(query, limit),
//         headers: apiConfig.headers || {},
//         timeout: 8000
//       };
      
//       const response = await axios(config);
//       return this.parseApiResponse(apiName, response.data, query);
      
//     } catch (error) {
//       console.warn(`${apiName} API failed:`, error.message);
//       return [];
//     }
//   }

//   parseApiResponse(apiName, data, query) {
//     switch (apiName) {
//       case 'arXiv':
//         return this.parseArxivResponse(data, query);
//       case 'SemanticScholar':
//         return this.parseSemanticScholarResponse(data, query);
//       case 'OpenAlex':
//         return this.parseOpenAlexResponse(data, query);
//       case 'CrossRef':
//         return this.parseCrossRefResponse(data, query);
//       case 'DOAJ':
//         return this.parseDOAJResponse(data, query);
//       case 'Zenodo':
//         return this.parseZenodoResponse(data, query);
//       case 'CORE':
//         return this.parseCOREResponse(data, query);
//       default:
//         return [];
//     }
//   }

//   parseArxivResponse(data, query) {
//     try {
//       const results = [];
//       const xmlText = data;
      
//       // Simple XML parsing for arXiv
//       const entryMatches = xmlText.match(/<entry>[\s\S]*?<\/entry>/g);
      
//       if (entryMatches) {
//         entryMatches.slice(0, 10).forEach((entry, index) => {
//           const titleMatch = entry.match(/<title[^>]*>([\s\S]*?)<\/title>/);
//           const summaryMatch = entry.match(/<summary[^>]*>([\s\S]*?)<\/summary>/);
//           const authorMatches = entry.match(/<name>([\s\S]*?)<\/name>/g);
//           const publishedMatch = entry.match(/<published>([\s\S]*?)<\/published>/);
//           const idMatch = entry.match(/<id>([\s\S]*?)<\/id>/);
          
//           if (titleMatch && summaryMatch) {
//             results.push({
//               title: titleMatch[1].replace(/\n/g, ' ').trim(),
//               content: summaryMatch[1].replace(/\n/g, ' ').trim(),
//               originalContent: summaryMatch[1].replace(/\n/g, ' ').trim(),
//               source: 'arXiv',
//               sourceType: 'preprint',
//               authors: authorMatches 
//                 ? authorMatches.map(m => m.replace(/<name>|<\/name>/g, '').trim())
//                 : ['arXiv Author'],
//               year: publishedMatch 
//                 ? new Date(publishedMatch[1]).getFullYear()
//                 : new Date().getFullYear(),
//               url: idMatch ? idMatch[1] : `https://arxiv.org/abs/${Date.now()}`,
//               pdfLink: idMatch ? idMatch[1].replace('/abs/', '/pdf/') : null,
//               isOpenAccess: true,
//               license: 'arXiv Non-exclusive',
//               isFree: true,
//               isPublicAPI: true
//             });
//           }
//         });
//       }
      
//       return results;
      
//     } catch (error) {
//       console.warn('arXiv parsing failed:', error.message);
//       return [];
//     }
//   }

//   parseSemanticScholarResponse(data, query) {
//     try {
//       return data.data?.map(paper => ({
//         title: paper.title,
//         content: paper.abstract || 'No abstract available',
//         originalContent: paper.abstract || 'No abstract',
//         source: 'Semantic Scholar',
//         sourceType: 'journal_article',
//         authors: paper.authors?.map(a => a.name) || ['Unknown'],
//         year: paper.year,
//         url: paper.url,
//         citationCount: paper.citationCount,
//         venue: paper.venue,
//         isOpenAccess: this.isOpenAccessVenue(paper.venue),
//         isFree: true,
//         isPublicAPI: true
//       })) || [];
//     } catch (error) {
//       console.warn('Semantic Scholar parsing failed:', error.message);
//       return [];
//     }
//   }

//   parseOpenAlexResponse(data, query) {
//     try {
//       return data.results?.map(work => ({
//         title: work.title || work.display_name,
//         content: work.abstract || work.display_name || 'No abstract',
//         originalContent: work.abstract || work.display_name,
//         source: 'OpenAlex',
//         sourceType: 'academic_work',
//         authors: work.authorships?.map(a => a.author.display_name) || ['Unknown'],
//         year: work.publication_year,
//         url: work.doi ? `https://doi.org/${work.doi}` : work.id,
//         doi: work.doi,
//         isOpenAccess: work.open_access?.is_oa || false,
//         isFree: work.open_access?.is_oa || false,
//         isPublicAPI: true
//       })) || [];
//     } catch (error) {
//       console.warn('OpenAlex parsing failed:', error.message);
//       return [];
//     }
//   }

//   parseCrossRefResponse(data, query) {
//     try {
//       return data.message.items?.map(item => ({
//         title: item.title?.[0],
//         content: item.abstract || 'No abstract',
//         originalContent: item.abstract,
//         source: 'CrossRef',
//         sourceType: 'journal_article',
//         authors: item.author?.map(a => `${a.given} ${a.family}`),
//         year: item.created?.['date-parts']?.[0]?.[0],
//         url: item.URL || (item.DOI ? `https://doi.org/${item.DOI}` : '#'),
//         doi: item.DOI,
//         license: item.license?.[0]?.URL,
//         isOpenAccess: item.license?.[0]?.URL?.includes('creativecommons') || false,
//         isFree: item.license?.[0]?.URL?.includes('creativecommons') || false,
//         isPublicAPI: true
//       })) || [];
//     } catch (error) {
//       console.warn('CrossRef parsing failed:', error.message);
//       return [];
//     }
//   }

//   parseDOAJResponse(data, query) {
//     try {
//       return data.results?.map(article => ({
//         title: article.bibjson.title,
//         content: article.bibjson.abstract || 'No abstract',
//         originalContent: article.bibjson.abstract,
//         source: 'DOAJ',
//         sourceType: 'journal_article',
//         authors: article.bibjson.author?.map(a => a.name),
//         year: article.bibjson.year,
//         url: article.bibjson.link?.find(l => l.type === 'fulltext')?.url,
//         journal: article.bibjson.journal?.title,
//         isOpenAccess: true, // DOAJ is open access only
//         isFree: true,
//         license: article.bibjson.license?.[0]?.type,
//         isPublicAPI: true
//       })) || [];
//     } catch (error) {
//       console.warn('DOAJ parsing failed:', error.message);
//       return [];
//     }
//   }

//   parseZenodoResponse(data, query) {
//     try {
//       return data.hits?.hits?.map(record => ({
//         title: record.metadata.title,
//         content: record.metadata.description || 'No description',
//         originalContent: record.metadata.description,
//         source: 'Zenodo',
//         sourceType: this.getZenodoType(record.metadata),
//         authors: record.metadata.creators?.map(c => c.name),
//         year: new Date(record.metadata.publication_date).getFullYear(),
//         url: record.links.html,
//         doi: record.doi,
//         pdfLink: record.files?.find(f => f.type === 'pdf')?.links?.download,
//         isOpenAccess: true, // Zenodo is open access
//         isFree: true,
//         license: record.metadata.license?.id,
//         isPublicAPI: true
//       })) || [];
//     } catch (error) {
//       console.warn('Zenodo parsing failed:', error.message);
//       return [];
//     }
//   }

//   parseCOREResponse(data, query) {
//     try {
//       return data.data?.map(item => ({
//         title: item.title,
//         content: item.description || 'No description',
//         originalContent: item.description,
//         source: 'CORE',
//         sourceType: 'academic_paper',
//         authors: item.authors,
//         year: item.year,
//         url: item.identifiers?.uri || item.url,
//         downloadUrl: item.downloadUrl,
//         isOpenAccess: item.openAccess || false,
//         isFree: item.openAccess || false,
//         isPublicAPI: true
//       })) || [];
//     } catch (error) {
//       console.warn('CORE parsing failed:', error.message);
//       return [];
//     }
//   }

//   getZenodoType(metadata) {
//     const type = metadata.resource_type?.type;
//     if (type === 'publication') return 'journal_article';
//     if (type === 'dataset') return 'dataset';
//     if (type === 'software') return 'software';
//     return 'research_output';
//   }

//   isOpenAccessVenue(venue) {
//     if (!venue) return false;
//     const oaVenues = [
//       'PLOS', 'BioMed Central', 'MDPI', 'Frontiers', 'PeerJ',
//       'eLife', 'Nature Communications', 'Scientific Reports'
//     ];
//     return oaVenues.some(oaVenue => venue.includes(oaVenue));
//   }

//   generateMockResults(query, limit) {
//     console.log('📚 Generating mock results (APIs failed)');
    
//     const sources = [
//       { name: 'arXiv', type: 'preprint' },
//       { name: 'Semantic Scholar', type: 'journal' },
//       { name: 'OpenAlex', type: 'academic' },
//       { name: 'CrossRef', type: 'journal' },
//       { name: 'DOAJ', type: 'open_access' },
//       { name: 'Zenodo', type: 'repository' }
//     ];
    
//     return Array.from({ length: limit }, (_, i) => {
//       const source = sources[i % sources.length];
//       const year = new Date().getFullYear() - Math.floor(Math.random() * 5);
      
//       return {
//         title: `${query} - ${source.name} Research ${i + 1}`,
//         content: `This ${source.type} from ${source.name} discusses "${query}". 
//         The research presents findings and analysis relevant to the topic.`,
//         originalContent: `Full research content about ${query} from ${source.name}. 
//         Published in ${year}. This is a ${source.type} discussing ${query}.`,
//         source: source.name,
//         sourceType: source.type,
//         authors: [`Researcher ${String.fromCharCode(65 + i)}`, 'Academic Team'],
//         year: year,
//         url: `https://${source.name.toLowerCase().replace(' ', '')}.org/paper/${i + 1}`,
//         relevanceScore: Math.max(1, 10 - i),
//         isOpenAccess: true,
//         isFree: true,
//         isMock: true,
//         note: 'Real data available via public API'
//       };
//     });
//   }
// }

// module.exports = AcademicService;
const axios = require('axios');
const cheerio = require('cheerio'); // Add this dependency: npm install cheerio

class AcademicService {
  constructor() {
    this.publicApis = {
      OpenAlex: {
        baseUrl: 'https://api.openalex.org/works',
        method: 'GET',
        params: (query, limit) => ({
          search: query,
          per_page: Math.min(limit, 25),
          filter: 'is_oa:true',
          sort: 'cited_by_count:desc'
        })
      },
      
      CrossRef: {
        baseUrl: 'https://api.crossref.org/works',
        method: 'GET',
        params: (query, limit) => ({
          query: query,
          rows: Math.min(limit, 20),
          select: 'title,author,abstract,DOI,created,published-online,issued,URL,license,subject,reference-count,citation-count',
          sort: 'relevance',
          order: 'desc'
        }),
        headers: {
          'User-Agent': 'BookResearchAssistant/1.0 (mailto:research@example.com)',
          'Accept': 'application/json'
        }
      },
      
      SemanticScholar: {
        baseUrl: 'https://api.semanticscholar.org/graph/v1/paper/search',
        method: 'GET',
        params: (query, limit) => ({
          query: query,
          limit: Math.min(limit, 20),
          fields: 'title,authors,year,abstract,url,citationCount,venue,fieldsOfStudy,publicationTypes,publicationDate,externalIds',
          offset: 0
        }),
        headers: {
          'Accept': 'application/json'
        }
      },
      
      Zenodo: {
        baseUrl: 'https://zenodo.org/api/records',
        method: 'GET',
        params: (query, limit) => ({
          q: query,
          size: Math.min(limit, 20),
          sort: 'mostrecent',
          all_versions: false,
          'file_type': 'pdf',
          'type': 'publication'
        })
      },
      
      arXiv: {
        baseUrl: 'http://export.arxiv.org/api/query',
        method: 'GET',
        params: (query, limit) => ({
          search_query: `all:"${encodeURIComponent(query)}"`,
          start: 0,
          max_results: Math.min(limit, 20),
          sortBy: 'relevance',
          sortOrder: 'descending'
        })
      },
      
      DOAJ: {
        baseUrl: 'https://doaj.org/api/v2/search/articles',
        method: 'GET',
        params: (query, limit) => ({
          q: `title:("${query}") OR abstract:("${query}")`,
          pageSize: Math.min(limit, 10)
        })
      }
    };
    
    // Enhanced configuration
    this.config = {
      timeout: 20000,
      maxRetries: 2,
      retryDelay: 1000
    };
  }

  async searchAllSources(query, limit = 15) {
    console.log(`🔍 Searching ALL platforms for: "${query}"`);
    
    const sources = ['OpenAlex', 'CrossRef', 'Semantic Scholar', 'Zenodo', 'arXiv', 'DOAJ'];
    const searchPromises = sources.map(source => 
      this.searchWithRetry(source, query, Math.ceil(limit / 4))
    );
    
    try {
      const results = await Promise.allSettled(searchPromises);
      
      // Process results
      const allResults = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value)
        .flat()
        .filter(r => r !== null && r.title);
      
      console.log(`✅ Found ${allResults.length} total results from all platforms`);
      
      // Remove duplicates based on title and DOI
      const uniqueResults = this.removeDuplicates(allResults);
      
      // Enhance with additional details
      const enhancedResults = await this.enhanceAllResults(uniqueResults);
      
      return enhancedResults.slice(0, limit);
      
    } catch (error) {
      console.error('Search failed:', error.message);
      return this.generateDetailedMockResults(query, limit);
    }
  }

  async searchWithRetry(source, query, limit, retryCount = 0) {
    try {
      const apiConfig = this.publicApis[source];
      if (!apiConfig) return [];
      
      console.log(`🔍 Fetching from ${source}...`);
      
      const config = {
        method: apiConfig.method,
        url: apiConfig.baseUrl,
        params: apiConfig.params(query, limit),
        headers: apiConfig.headers || {},
        timeout: this.config.timeout
      };
      
      const response = await axios(config);
      return this.parseApiResponse(source, response.data, query);
      
    } catch (error) {
      if (retryCount < this.config.maxRetries) {
        console.log(`Retrying ${source} (${retryCount + 1}/${this.config.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.searchWithRetry(source, query, limit, retryCount + 1);
      }
      console.warn(`${source} failed after retries:`, error.message);
      return [];
    }
  }

  async enhanceAllResults(results) {
    console.log(`🔧 Enhancing ${results.length} results with additional details...`);
    
    const enhancedPromises = results.map(async (result, index) => {
      try {
        // Add delay to avoid rate limiting
        if (index > 0) await new Promise(resolve => setTimeout(resolve, 100));
        
        const enhanced = await this.enrichResultWithDetails(result);
        return enhanced;
      } catch (error) {
        console.warn(`Failed to enhance result ${index}:`, error.message);
        return result; // Return original if enhancement fails
      }
    });
    
    return Promise.all(enhancedPromises);
  }

  async enrichResultWithDetails(result) {
    // If we already have good content, return as-is
    if (result.content && result.content.length > 150 && 
        !result.content.includes('Relevant research about')) {
      return result;
    }
    
    // Try to fetch more details based on source
    switch (result.source) {
      case 'OpenAlex':
        return await this.enrichOpenAlexResult(result);
      case 'CrossRef':
        return await this.enrichCrossRefResult(result);
      case 'Semantic Scholar':
        return await this.enrichSemanticScholarResult(result);
      case 'Zenodo':
        return await this.enrichZenodoResult(result);
      case 'arXiv':
        return await this.enrichArxivResult(result);
      default:
        // Try to fetch abstract from URL if available
        return await this.fetchAbstractFromUrl(result);
    }
  }

  // --- OPENALEX PARSING & ENHANCEMENT ---
  parseOpenAlexResponse(data, query) {
    try {
      if (!data.results || !Array.isArray(data.results)) return [];
      
      return data.results.map(work => {
        const abstract = work.abstract_inverted_index 
          ? this.reconstructAbstract(work.abstract_inverted_index)
          : (work.abstract || '');
        
        return {
          id: work.id || `openalex_${work.doi || Date.now()}`,
          title: work.title || work.display_name,
          content: abstract || `Research from OpenAlex on ${query}`,
          originalContent: abstract,
          source: 'OpenAlex',
          sourceType: this.getOpenAlexType(work.type),
          authors: work.authorships?.map(a => a.author.display_name) || ['Unknown'],
          year: work.publication_year,
          url: work.doi ? `https://doi.org/${work.doi}` : work.id,
          doi: work.doi,
          openalexId: work.id,
          citedByCount: work.cited_by_count,
          keywords: work.concepts?.map(c => c.display_name) || [],
          isOpenAccess: work.open_access?.is_oa || false,
          oaUrl: work.open_access?.oa_url,
          isFree: work.open_access?.is_oa || false,
          pdfLink: work.open_access?.oa_url,
          venue: work.host_venue?.display_name,
          publicationDate: work.publication_date,
          language: work.language,
          rawData: work // Keep raw data for later enhancement
        };
      });
    } catch (error) {
      console.warn('OpenAlex parsing failed:', error.message);
      return [];
    }
  }

  async enrichOpenAlexResult(result) {
    try {
      if (!result.openalexId) return result;
      
      const response = await axios.get(result.openalexId, {
        params: {
          select: 'abstract,referenced_works,related_works,counts_by_year,biblio,topics'
        },
        timeout: 10000
      });
      
      const work = response.data;
      const abstract = work.abstract_inverted_index 
        ? this.reconstructAbstract(work.abstract_inverted_index)
        : (work.abstract || result.content);
      
      return {
        ...result,
        content: abstract.substring(0, 500) + (abstract.length > 500 ? '...' : ''),
        originalContent: abstract,
        keywords: work.topics?.map(t => t.display_name) || result.keywords,
        referencedWorks: work.referenced_works,
        relatedWorks: work.related_works,
        citationHistory: work.counts_by_year,
        bibliography: work.biblio
      };
    } catch (error) {
      return result;
    }
  }

  // --- CROSSREF PARSING & ENHANCEMENT ---
  parseCrossRefResponse(data, query) {
    try {
      if (!data.message || !data.message.items) return [];
      
      return data.message.items.map(item => {
        const abstract = this.extractCrossRefAbstract(item);
        
        return {
          id: `crossref_${item.DOI || Date.now()}`,
          title: item.title?.[0] || 'Untitled',
          content: abstract || `Research from CrossRef on ${query}`,
          originalContent: abstract,
          source: 'CrossRef',
          sourceType: item.type || 'journal_article',
          authors: item.author?.map(a => `${a.given || ''} ${a.family || ''}`.trim()) || ['Unknown'],
          year: item.created?.['date-parts']?.[0]?.[0] || 
                item.published?.['date-parts']?.[0]?.[0] ||
                item.issued?.['date-parts']?.[0]?.[0] ||
                new Date().getFullYear(),
          url: item.URL || (item.DOI ? `https://doi.org/${item.DOI}` : '#'),
          doi: item.DOI,
          citationCount: item['citation-count'],
          referenceCount: item['reference-count'],
          subject: item.subject || [],
          license: item.license?.[0]?.URL,
          publisher: item.publisher,
          journal: item['container-title']?.[0],
          isOpenAccess: this.isOpenAccess(item.license?.[0]?.URL),
          isFree: this.isOpenAccess(item.license?.[0]?.URL),
          rawData: item
        };
      });
    } catch (error) {
      console.warn('CrossRef parsing failed:', error.message);
      return [];
    }
  }

  async enrichCrossRefResult(result) {
    try {
      if (!result.doi) return result;
      
      const response = await axios.get(
        `https://api.crossref.org/works/${result.doi}`,
        { timeout: 10000 }
      );
      
      const item = response.data.message;
      const abstract = this.extractCrossRefAbstract(item);
      
      return {
        ...result,
        content: abstract || result.content,
        originalContent: abstract,
        referenceList: item.reference,
        funding: item.funder,
        updatePolicy: item['update-policy'],
        archive: item.archive,
        clinicalTrialNumber: item['clinical-trial-number']
      };
    } catch (error) {
      return result;
    }
  }

  // --- SEMANTIC SCHOLAR PARSING & ENHANCEMENT ---
  parseSemanticScholarResponse(data, query) {
    try {
      if (!data.data || !Array.isArray(data.data)) return [];
      
      return data.data.map(paper => {
        return {
          id: `semanticscholar_${paper.paperId || Date.now()}`,
          title: paper.title,
          content: paper.abstract || `Research from Semantic Scholar on ${query}`,
          originalContent: paper.abstract,
          source: 'Semantic Scholar',
          sourceType: 'journal_article',
          authors: paper.authors?.map(a => a.name) || ['Unknown'],
          year: paper.year,
          url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
          paperId: paper.paperId,
          citationCount: paper.citationCount,
          venue: paper.venue,
          fieldsOfStudy: paper.fieldsOfStudy,
          publicationTypes: paper.publicationTypes,
          publicationDate: paper.publicationDate,
          externalIds: paper.externalIds,
          isOpenAccess: paper.isOpenAccess || this.isOpenAccessVenue(paper.venue),
          isFree: paper.isOpenAccess || false,
          pdfLink: paper.openAccessPdf?.url,
          tldr: paper.tldr?.text,
          rawData: paper
        };
      });
    } catch (error) {
      console.warn('Semantic Scholar parsing failed:', error.message);
      return [];
    }
  }

  async enrichSemanticScholarResult(result) {
    try {
      if (!result.paperId) return result;
      
      const response = await axios.get(
        `https://api.semanticscholar.org/graph/v1/paper/${result.paperId}`,
        {
          params: {
            fields: 'abstract,tldr,citations,references,influentialCitationCount,embedding,topics'
          },
          timeout: 10000
        }
      );
      
      const paper = response.data;
      
      return {
        ...result,
        content: paper.abstract || result.content,
        originalContent: paper.abstract,
        tldr: paper.tldr?.text || result.tldr,
        citations: paper.citations?.slice(0, 5),
        references: paper.references?.slice(0, 5),
        influentialCitationCount: paper.influentialCitationCount,
        topics: paper.topics,
        embedding: paper.embedding?.vector ? 'Available' : null
      };
    } catch (error) {
      return result;
    }
  }

  // --- ZENODO PARSING & ENHANCEMENT ---
  parseZenodoResponse(data, query) {
    try {
      if (!data.hits || !data.hits.hits) return [];
      
      return data.hits.hits.map(record => {
        const metadata = record.metadata;
        const description = metadata.description || '';
        
        return {
          id: `zenodo_${record.id}`,
          title: metadata.title,
          content: this.cleanZenodoDescription(description) || `Research from Zenodo on ${query}`,
          originalContent: description,
          source: 'Zenodo',
          sourceType: this.getZenodoType(metadata),
          authors: metadata.creators?.map(c => c.name) || ['Unknown'],
          year: new Date(metadata.publication_date || metadata.issued || Date.now()).getFullYear(),
          url: record.links.html,
          doi: record.doi,
          zenodoId: record.id,
          pdfLink: record.files?.find(f => f.type === 'pdf')?.links?.download,
          downloadLinks: record.files?.map(f => ({
            name: f.key,
            type: f.type,
            size: f.size,
            link: f.links.download
          })),
          keywords: metadata.keywords || [],
          license: metadata.license?.id,
          version: metadata.version,
          communities: metadata.communities?.map(c => c.id),
          isOpenAccess: true,
          isFree: true,
          rawData: record
        };
      });
    } catch (error) {
      console.warn('Zenodo parsing failed:', error.message);
      return [];
    }
  }

  async enrichZenodoResult(result) {
    try {
      if (!result.zenodoId) return result;
      
      const response = await axios.get(
        `https://zenodo.org/api/records/${result.zenodoId}`,
        { timeout: 10000 }
      );
      
      const record = response.data;
      const metadata = record.metadata;
      
      return {
        ...result,
        content: this.cleanZenodoDescription(metadata.description) || result.content,
        originalContent: metadata.description,
        relatedIdentifiers: metadata.related_identifiers,
        contributors: metadata.contributors,
        grants: metadata.grants,
        locations: metadata.locations,
        dates: metadata.dates,
        additionalDescriptions: metadata.additional_descriptions
      };
    } catch (error) {
      return result;
    }
  }

  // --- ARXIV PARSING & ENHANCEMENT ---
  parseArxivResponse(data, query) {
    try {
      const results = [];
      const entries = data.match(/<entry>[\s\S]*?<\/entry>/g) || [];
      
      entries.forEach(entry => {
        const title = this.extractXmlValue(entry, 'title');
        const summary = this.extractXmlValue(entry, 'summary');
        const authors = this.extractXmlValues(entry, 'name');
        const published = this.extractXmlValue(entry, 'published');
        const id = this.extractXmlValue(entry, 'id');
        const categories = this.extractXmlAttributes(entry, 'category', 'term');
        
        if (title) {
          const cleanSummary = summary ? summary.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';
          
          results.push({
            id: `arxiv_${id?.split('/').pop() || Date.now()}`,
            title: title.replace(/\n/g, ' ').trim(),
            content: cleanSummary.substring(0, 300) + (cleanSummary.length > 300 ? '...' : ''),
            originalContent: cleanSummary,
            source: 'arXiv',
            sourceType: 'preprint',
            authors: authors.length > 0 ? authors : ['arXiv Author'],
            year: published ? new Date(published).getFullYear() : new Date().getFullYear(),
            url: id || `https://arxiv.org/abs/${Date.now()}`,
            arxivId: id?.split('/abs/').pop() || id?.split('/').pop(),
            pdfLink: id ? id.replace('/abs/', '/pdf/') + '.pdf' : null,
            categories: categories,
            license: 'arXiv Non-exclusive',
            isOpenAccess: true,
            isFree: true,
            rawData: entry
          });
        }
      });
      
      return results;
    } catch (error) {
      console.warn('arXiv parsing failed:', error.message);
      return [];
    }
  }

  async enrichArxivResult(result) {
    try {
      if (!result.arxivId) return result;
      
      const response = await axios.get('http://export.arxiv.org/api/query', {
        params: {
          id_list: result.arxivId,
          start: 0,
          max_results: 1
        },
        timeout: 10000
      });
      
      const entry = response.data.match(/<entry>[\s\S]*?<\/entry>/);
      if (entry) {
        const summary = this.extractXmlValue(entry[0], 'summary');
        if (summary) {
          const cleanSummary = summary.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          return {
            ...result,
            content: cleanSummary.substring(0, 500) + (cleanSummary.length > 500 ? '...' : ''),
            originalContent: cleanSummary
          };
        }
      }
      return result;
    } catch (error) {
      return result;
    }
  }

  // --- HELPER METHODS ---
  async fetchAbstractFromUrl(result) {
    try {
      if (!result.url || result.url === '#') return result;
      
      // Try to fetch and parse HTML for abstract
      const response = await axios.get(result.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      
      // Common abstract selectors
      const abstractSelectors = [
        'meta[name="description"]',
        'meta[property="og:description"]',
        '.abstract',
        '#abstract',
        '[class*="abstract"]',
        '.article-abstract',
        '.article-body > p:first-child'
      ];
      
      let abstract = '';
      for (const selector of abstractSelectors) {
        const element = $(selector);
        if (element.length) {
          abstract = element.attr('content') || element.text();
          if (abstract.length > 100) break;
        }
      }
      
      if (abstract.length > 50) {
        return {
          ...result,
          content: abstract.substring(0, 300) + (abstract.length > 300 ? '...' : ''),
          originalContent: abstract
        };
      }
      
      return result;
    } catch (error) {
      return result;
    }
  }

  reconstructAbstract(invertedIndex) {
    if (!invertedIndex) return '';
    
    try {
      // Inverted index reconstruction logic
      const words = [];
      const positions = {};
      
      for (const [word, positionsArray] of Object.entries(invertedIndex)) {
        positionsArray.forEach(pos => {
          positions[pos] = word;
        });
      }
      
      // Sort positions and build text
      const sortedPositions = Object.keys(positions).map(Number).sort((a, b) => a - b);
      sortedPositions.forEach(pos => {
        words.push(positions[pos]);
      });
      
      return words.join(' ');
    } catch (error) {
      return '';
    }
  }

  extractCrossRefAbstract(item) {
    if (item.abstract) {
      // Clean JATS XML abstract
      const abstract = item.abstract.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      return abstract;
    }
    return '';
  }

  cleanZenodoDescription(description) {
    if (!description) return '';
    
    // Remove HTML tags
    const clean = description.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return clean.substring(0, 300) + (clean.length > 300 ? '...' : '');
  }

  extractXmlValue(xml, tag) {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`);
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
  }

  extractXmlValues(xml, tag) {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'g');
    const matches = xml.match(regex) || [];
    return matches.map(m => m.replace(new RegExp(`<\/?${tag}[^>]*>`), '').trim());
  }

  extractXmlAttributes(xml, tag, attribute) {
    const regex = new RegExp(`<${tag}[^>]*${attribute}="([^"]*)"[^>]*>`, 'g');
    const matches = xml.match(regex) || [];
    return matches.map(m => {
      const attrMatch = m.match(new RegExp(`${attribute}="([^"]*)"`));
      return attrMatch ? attrMatch[1] : '';
    });
  }

  getOpenAlexType(type) {
    const typeMap = {
      'article': 'journal_article',
      'book': 'book',
      'book-chapter': 'book_chapter',
      'dissertation': 'thesis',
      'dataset': 'dataset',
      'preprint': 'preprint'
    };
    return typeMap[type] || type;
  }

  getZenodoType(metadata) {
    const type = metadata.resource_type?.type;
    const typeMap = {
      'publication': 'publication',
      'dataset': 'dataset',
      'software': 'software',
      'image': 'image',
      'video': 'video',
      'other': 'other'
    };
    return typeMap[type] || 'research_output';
  }

  isOpenAccess(licenseUrl) {
    if (!licenseUrl) return false;
    return licenseUrl.includes('creativecommons') || 
           licenseUrl.includes('openaccess') ||
           licenseUrl.toLowerCase().includes('cc-');
  }

  isOpenAccessVenue(venue) {
    if (!venue) return false;
    const oaVenues = [
      'PLOS', 'BioMed Central', 'MDPI', 'Frontiers', 'PeerJ',
      'eLife', 'Nature Communications', 'Scientific Reports',
      'arXiv', 'Zenodo', 'DOAJ'
    ];
    return oaVenues.some(oaVenue => venue.includes(oaVenue));
  }

  removeDuplicates(results) {
    const seen = new Set();
    return results.filter(result => {
      // Create unique key from title + DOI + source
      const key = `${result.title}_${result.doi || ''}_${result.source}`.toLowerCase();
      
      // Skip if we've seen this before
      if (seen.has(key)) return false;
      
      // Skip if title is too short or generic
      if (!result.title || result.title.length < 10) return false;
      
      seen.add(key);
      return true;
    });
  }

  generateDetailedMockResults(query, limit) {
    console.log('📚 Generating detailed mock results');
    
    const sources = [
      { name: 'OpenAlex', type: 'academic_work' },
      { name: 'CrossRef', type: 'journal_article' },
      { name: 'Semantic Scholar', type: 'journal_article' },
      { name: 'Zenodo', type: 'research_output' },
      { name: 'arXiv', type: 'preprint' },
      { name: 'DOAJ', type: 'open_access_journal' }
    ];
    
    const currentYear = new Date().getFullYear();
    
    return Array.from({ length: limit }, (_, i) => {
      const source = sources[i % sources.length];
      const year = currentYear - Math.floor(Math.random() * 5);
      const isRecent = (currentYear - year) <= 2;
      
      // Generate realistic content based on query
      const abstract = `This ${source.type} from ${source.name} provides comprehensive research on "${query}". 
      The study employs ${['quantitative', 'qualitative', 'mixed-methods'][i % 3]} methodology 
      to investigate key aspects of ${query}. Findings suggest significant implications for 
      ${['theory', 'practice', 'policy', 'future research'][i % 4]} in the field.`;
      
      return {
        id: `mock_${Date.now()}_${i}`,
        title: `"${query}": A ${['Comprehensive', 'Critical', 'Systematic', 'Novel'][i % 4]} Study from ${source.name}`,
        content: abstract.substring(0, 200) + '...',
        originalContent: abstract,
        source: source.name,
        sourceType: source.type,
        authors: [
          `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i % 5]}`,
          `Prof. ${['Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'][i % 5]}`
        ],
        year: year,
        url: `https://${source.name.toLowerCase().replace(' ', '')}.org/doi/10.1000/${i}`,
        doi: `10.1000/mock${i}`,
        citationCount: Math.floor(Math.random() * 100),
        keywords: [query, 'research', 'study', 'academic', source.type],
        isOpenAccess: true,
        isFree: true,
        pdfLink: `https://${source.name.toLowerCase().replace(' ', '')}.org/pdf/mock${i}.pdf`,
        license: 'CC BY 4.0',
        isMock: true,
        note: `Real data available from ${source.name} API`
      };
    });
  }

  parseApiResponse(apiName, data, query) {
    switch (apiName) {
      case 'OpenAlex':
        return this.parseOpenAlexResponse(data, query);
      case 'CrossRef':
        return this.parseCrossRefResponse(data, query);
      case 'SemanticScholar':
        return this.parseSemanticScholarResponse(data, query);
      case 'Zenodo':
        return this.parseZenodoResponse(data, query);
      case 'arXiv':
        return this.parseArxivResponse(data, query);
      case 'DOAJ':
        return this.parseDOAJResponse(data, query);
      default:
        console.warn(`Unknown API: ${apiName}`);
        return [];
    }
  }

  parseDOAJResponse(data, query) {
    try {
      if (!data.results || !Array.isArray(data.results)) return [];
      
      return data.results.map(article => {
        return {
          id: `doaj_${article.id}`,
          title: article.bibjson.title,
          content: article.bibjson.abstract || `Open access article from DOAJ on ${query}`,
          originalContent: article.bibjson.abstract,
          source: 'DOAJ',
          sourceType: 'open_access_journal',
          authors: article.bibjson.author?.map(a => a.name) || ['Unknown'],
          year: article.bibjson.year,
          url: article.bibjson.link?.find(l => l.type === 'fulltext')?.url,
          doi: article.bibjson.identifier?.find(id => id.type === 'doi')?.id,
          journal: article.bibjson.journal?.title,
          keywords: article.bibjson.keywords || [],
          license: article.bibjson.license?.[0]?.type,
          publisher: article.bibjson.journal?.publisher,
          isOpenAccess: true,
          isFree: true,
          rawData: article
        };
      });
    } catch (error) {
      console.warn('DOAJ parsing failed:', error.message);
      return [];
    }
  }
}

module.exports = AcademicService;
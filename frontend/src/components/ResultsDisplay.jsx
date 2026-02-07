
import React from 'react';
import { 
  Box, 
  Typography, 
  Alert, 
  AlertTitle, 
  Chip, 
  Paper, 
  Divider,
  Stack,
  Grid,
  Container,
} from '@mui/material';
import ResultCard from './ResultCard';
import ScienceIcon from '@mui/icons-material/Science';
import PublicIcon from '@mui/icons-material/Public';
import NumbersIcon from '@mui/icons-material/Numbers';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const ResultsDisplay = ({ results = [], searchInfo = {}, searchMetrics = null }) => {
  // Ensure results is always an array
  const validResults = Array.isArray(results) ? results : [];
  
  if (validResults.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No results found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search criteria
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Search Summary */}
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 4, 
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScienceIcon color="primary" />
            <Typography variant="h5" component="h2" sx={{ 
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
              fontWeight: 700,
            }}>
              Search Results
            </Typography>
          </Box>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Box>
              <Typography variant="body1" color="text.primary" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}>
                <NumbersIcon fontSize="small" />
                Found {searchInfo?.count || validResults.length} research papers
              </Typography>
              {searchInfo?.searchedAt && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Searched at: {new Date(searchInfo.searchedAt).toLocaleString()}
                </Typography>
              )}
            </Box>
            
            {searchInfo?.sources && Object.keys(searchInfo.sources).length > 0 && (
              <Box>
                <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                  Sources:
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {Object.entries(searchInfo.sources).map(([source, count]) => (
                    <Chip 
                      key={source}
                      label={`${source}: ${count}`}
                      size="small"
                      variant="outlined"
                      icon={<PublicIcon fontSize="small" />}
                      sx={{ 
                        mb: 0.5,
                        fontSize: '0.75rem',
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>

          {/* Search Metrics Display */}
          {searchMetrics && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AnalyticsIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Search Analytics
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      bgcolor: 'primary.50',
                      border: '1px solid',
                      borderColor: 'primary.100',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" display="block">
                      Total Papers
                    </Typography>
                    <Typography variant="h4" fontWeight={800} color="primary.main">
                      {searchMetrics.totalResults}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      bgcolor: 'success.50',
                      border: '1px solid',
                      borderColor: 'success.100',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" display="block">
                      Open Access
                    </Typography>
                    <Typography variant="h4" fontWeight={800} color="success.main">
                      {searchMetrics.openAccessCount}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      bgcolor: 'warning.50',
                      border: '1px solid',
                      borderColor: 'warning.100',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" display="block">
                      Avg. Relevance
                    </Typography>
                    <Typography variant="h4" fontWeight={800} color="warning.main">
                      {searchMetrics.avgRelevance}/10
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      bgcolor: 'info.50',
                      border: '1px solid',
                      borderColor: 'info.100',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" display="block">
                      Search Time
                    </Typography>
                    <Typography variant="h4" fontWeight={800} color="info.main">
                      {searchMetrics.searchTime ? 
                        `${((new Date() - searchMetrics.searchTime) / 1000).toFixed(1)}s` : 
                        'N/A'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {searchInfo?.hasMockData && (
            <Alert 
              severity="info" 
              sx={{ mt: 2 }}
              variant="outlined"
            >
              <AlertTitle>Note</AlertTitle>
              Showing sample data. Configure API keys for real academic papers.
            </Alert>
          )}
        </Stack>
      </Paper>

      {/* Results Grid - Masonry Layout */}
      <Box sx={{ 
        columnCount: { xs: 1, sm: 2, md: 3 },
        columnGap: 3,
        '& > *': {
          breakInside: 'avoid',
          mb: 3,
        }
      }}>
        {validResults.map((result, index) => (
          <Box key={result.id || result.url || `result-${index}`} sx={{ mb: 3 }}>
            <ResultCard result={result} index={index} />
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          bgcolor: 'grey.50',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          Showing {validResults.length} of {searchInfo?.count || validResults.length} results • 
          Sorted by relevance • 
          {searchInfo?.hasMockData ? ' Sample data for demonstration' : ' Real academic papers'}
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
        AI • OpenAlex • Academic Search APIs
        </Typography>
      </Paper>
    </Container>
  );
};

export default ResultsDisplay;
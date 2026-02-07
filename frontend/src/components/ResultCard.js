
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Link, 
  IconButton, 
  Tooltip,
  Stack,
  Collapse,
  Button,
  Paper,
  Avatar,
  LinearProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Download as DownloadIcon,
  Copyright as CopyrightIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Insights as InsightsIcon,
  Science as ScienceIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const ResultCard = ({ result, index }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [expanded, setExpanded] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  if (!result) return null;

  // Enhanced data extraction from API response
  const title = result.title || 'Untitled Research';
  const content = result.content || 'No content available';
  const originalContent = result.originalContent || content;
  const source = result.source || 'Unknown Source';
  const sourceType = result.sourceType || 'academic';
  const authors = Array.isArray(result.authors) ? result.authors : ['Unknown Author'];
  const year = result.year || 'N/A';
  const doi = result.doi || null;
  const url = result.url || '#';
  const relevanceScore = result.relevanceScore || 5;
  const keywords = Array.isArray(result.keywords) ? result.keywords : [];
  const license = result.license || 'Unknown';
  const isOpenAccess = result.isOpenAccess || false;
  const isFree = result.isFree || false;
  const costSavings = result.costSavings || 0;
  const confidence = result.confidence || 0;
  const keyInsights = Array.isArray(result.keyInsights) ? result.keyInsights : [];
  const practicalApplications = Array.isArray(result.practicalApplications) ? result.practicalApplications : [];
  const downloadLinks = Array.isArray(result.downloadLinks) ? result.downloadLinks : [];
  
  // Create enhanced preview based on screen size
  const previewLength = isMobile ? 80 : isTablet ? 100 : 120;
  const preview = content.length > previewLength 
    ? content.substring(0, previewLength) + '...' 
    : content;

  // Source color mapping
  const sourceColors = {
    'Zenodo': '#168DD9',
    'OpenAlex': '#4CAF50',
    'arXiv': '#B31B1B',
    'Semantic Scholar': '#FF9800',
    'Google Scholar': '#4285F4',
  };

  // Source icon mapping
  const sourceIcons = {
    'Zenodo': 'Z',
    'OpenAlex': 'OA',
    'arXiv': 'arXiv',
    'Semantic Scholar': 'SS',
    'Google Scholar': 'GS',
  };

  const sourceColor = sourceColors[source] || '#666';
  const sourceIcon = sourceIcons[source] || source.charAt(0);

  return (
    <>
      <Card 
        sx={{ 
          display: 'inline-block',
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid',
          borderColor: 'grey.100',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            borderColor: 'primary.light',
          },
        }}
      >
        {/* Header with gradient */}
        <Box
          sx={{
            background: `linear-gradient(90deg, ${sourceColor}15, transparent)`,
            p: isMobile ? 1.5 : 2,
            borderBottom: '1px solid',
            borderColor: 'grey.100',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1, mr: isMobile ? 1 : 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Avatar
                  sx={{
                    width: isMobile ? 24 : 32,
                    height: isMobile ? 24 : 32,
                    bgcolor: sourceColor,
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    fontWeight: 700,
                  }}
                >
                  {sourceIcon}
                </Avatar>
                <Typography variant="caption" sx={{ 
                  color: sourceColor,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                }}>
                  {source}
                </Typography>
              </Box>
              
              <Typography 
                variant="h6" 
                component="h3"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.3,
                  mb: 0.5,
                  color: 'text.primary',
                  fontSize: isMobile ? '0.875rem' : isTablet ? '1rem' : '1.125rem',
                  wordBreak: 'break-word',
                }}
              >
                {title}
              </Typography>
            </Box>

            <Stack direction="row" spacing={isMobile ? 0.5 : 1} alignItems="center">
              {/* Relevance Score */}
              <Tooltip title="Relevance Score">
                <Paper
                  elevation={0}
                  sx={{
                    px: isMobile ? 1 : 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${
                      relevanceScore >= 8 ? '#10B981' :
                      relevanceScore >= 6 ? '#F59E0B' :
                      '#EF4444'
                    }20, transparent)`,
                    border: '1px solid',
                    borderColor: relevanceScore >= 8 ? '#10B98140' :
                                relevanceScore >= 6 ? '#F59E0B40' :
                                '#EF444440',
                    minWidth: isMobile ? 50 : 'auto',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ 
                      fontSize: isMobile ? 12 : 14,
                      color: relevanceScore >= 8 ? '#10B981' :
                            relevanceScore >= 6 ? '#F59E0B' :
                            '#EF4444',
                    }} />
                    <Typography variant="caption" fontWeight={700} sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}>
                      {relevanceScore}/10
                    </Typography>
                  </Box>
                </Paper>
              </Tooltip>
            </Stack>
          </Box>
        </Box>

        <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
          {/* Content Preview */}
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              lineHeight: 1.6,
              color: 'text.secondary',
              fontSize: isMobile ? '0.8125rem' : '0.875rem',
            }}
          >
            {preview}
          </Typography>

          {/* Key Insights (if available) */}
          {keyInsights.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={700} sx={{ 
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 0.5,
                fontSize: isMobile ? '0.7rem' : '0.75rem',
              }}>
                <InsightsIcon fontSize={isMobile ? 'small' : 'small'} />
                KEY INSIGHTS
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {keyInsights.slice(0, isMobile ? 2 : 3).map((insight, idx) => (
                  <Chip
                    key={idx}
                    label={insight}
                    size="small"
                    sx={{
                      borderRadius: 1,
                      backgroundColor: 'primary.lighter',
                      color: 'primary.dark',
                      fontWeight: 500,
                      fontSize: isMobile ? '0.65rem' : '0.75rem',
                      height: isMobile ? 20 : 24,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Metadata Row */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: isMobile ? 1 : 1.5, 
            mb: 2,
            alignItems: 'center',
          }}>
            {/* Authors */}
            <Tooltip title={authors.join(', ')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PersonIcon fontSize={isMobile ? "small" : "small"} sx={{ color: 'grey.600' }} />
                <Typography variant="caption" sx={{ 
                  fontWeight: 500,
                  color: 'text.primary',
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                }}>
                  {authors.slice(0, 1).join(', ')}
                  {authors.length > 1 && ' et al.'}
                </Typography>
              </Box>
            </Tooltip>

            {/* Year */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon fontSize={isMobile ? "small" : "small"} sx={{ color: 'grey.600' }} />
              <Typography variant="caption" sx={{ fontWeight: 500, fontSize: isMobile ? '0.7rem' : '0.75rem' }}>
                {year}
              </Typography>
            </Box>

            {/* Confidence Score */}
            {confidence > 0 && !isMobile && (
              <Tooltip title={`Confidence: ${Math.round(confidence * 100)}%`}>
                <Box sx={{ width: 40 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={confidence * 100}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(90deg, ${
                          confidence >= 0.8 ? '#10B981' :
                          confidence >= 0.6 ? '#F59E0B' :
                          '#EF4444'
                        }, ${confidence >= 0.8 ? '#34D399' :
                          confidence >= 0.6 ? '#FBBF24' :
                          '#F87171'})`,
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>
              </Tooltip>
            )}
          </Box>

          {/* Keywords */}
          {keywords.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={700} sx={{ 
                color: 'text.secondary',
                mb: 0.5,
                display: 'block',
                fontSize: isMobile ? '0.7rem' : '0.75rem',
              }}>
                TOPICS:
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {keywords.slice(0, isMobile ? 3 : 4).map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: 0.5,
                      fontSize: isMobile ? '0.65rem' : '0.75rem',
                      mb: 0.5,
                      height: isMobile ? 20 : 24,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Action Bar */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pt: 1.5,
            borderTop: '1px solid',
            borderColor: 'grey.100',
          }}>
            <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
              {/* Access Status */}
              {isOpenAccess && (
                <Chip
                  icon={!isMobile && <CheckCircleIcon />}
                  label={isMobile ? "OA" : "Open Access"}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ 
                    borderRadius: 1,
                    fontSize: isMobile ? '0.65rem' : '0.75rem',
                    height: isMobile ? 20 : 24,
                  }}
                />
              )}
              {isFree && !isOpenAccess && (
                <Chip
                  label="Free"
                  size="small"
                  color="success"
                  sx={{ 
                    borderRadius: 1,
                    fontSize: isMobile ? '0.65rem' : '0.75rem',
                    height: isMobile ? 20 : 24,
                  }}
                />
              )}
            </Stack>

            <Stack direction="row" spacing={0.5}>
              {/* View Details Button */}
              <Button
                size="small"
                endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setExpanded(!expanded)}
                sx={{ 
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                  minWidth: 'auto',
                  px: isMobile ? 1 : 1.5,
                }}
              >
                {isMobile ? (expanded ? 'Less' : 'More') : (expanded ? 'Show Less' : 'Show More')}
              </Button>

              {/* Download Button */}
              {downloadLinks.length > 0 && (
                <Tooltip title="Download PDF">
                  <IconButton 
                    size="small" 
                    component={Link}
                    href={
                      // Safely construct download URL
                      result.zenodoId && downloadLinks[0]?.name
                        ? `https://zenodo.org/api/records/${result.zenodoId}/files/${downloadLinks[0].name}/content`
                        : result.url
                    }
                    target="_blank"
                    sx={{ 
                      borderRadius: 1,
                      bgcolor: 'primary.lighter',
                      '&:hover': {
                        bgcolor: 'primary.light',
                      },
                      width: isMobile ? 28 : 32,
                      height: isMobile ? 28 : 32,
                    }}
                  >
                    <DownloadIcon fontSize={isMobile ? "small" : "small"} />
                  </IconButton>
                </Tooltip>
              )}

              {/* External Link */}
              <Tooltip title="Open in new tab">
                <IconButton 
                  size="small" 
                  component={Link} 
                  href={url} 
                  target="_blank"
                  sx={{ 
                    borderRadius: 1,
                    bgcolor: 'grey.100',
                    '&:hover': {
                      bgcolor: 'grey.200',
                    },
                    width: isMobile ? 28 : 32,
                    height: isMobile ? 28 : 32,
                  }}
                >
                  <OpenInNewIcon fontSize={isMobile ? "small" : "small"} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Expanded Content */}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              
              {/* Practical Applications */}
              {practicalApplications.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ 
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                  }}>
                    <ScienceIcon fontSize="small" />
                    PRACTICAL APPLICATIONS
                  </Typography>
                  <Stack spacing={0.5}>
                    {practicalApplications.slice(0, 3).map((app, idx) => (
                      <Typography key={idx} variant="body2" sx={{ 
                        pl: 2,
                        position: 'relative',
                        fontSize: isMobile ? '0.8125rem' : '0.875rem',
                        '&::before': {
                          content: '"•"',
                          position: 'absolute',
                          left: 0,
                          color: 'primary.main',
                          fontWeight: 'bold',
                        },
                      }}>
                        {app}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* View Raw Data Button */}
              <Button
                size="small"
                startIcon={<InfoIcon />}
                onClick={() => setOpenDetails(true)}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                }}
              >
                View Technical Details
              </Button>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog 
        open={openDetails} 
        onClose={() => setOpenDetails(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
          fontSize: isMobile ? '1rem' : '1.25rem',
        }}>
          Technical Details
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 2,
              fontFamily: 'monospace',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              maxHeight: isMobile ? '60vh' : 400,
              overflow: 'auto',
            }}
          >
            {JSON.stringify(result, null, 2)}
          </Paper>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button 
            onClick={() => setOpenDetails(false)} 
            size={isMobile ? "small" : "medium"}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResultCard;
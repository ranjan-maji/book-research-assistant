// import React, { useState } from 'react';
// import {
//   Box,
//   TextField,
//   Button,
//   Paper,
//   Typography,
//   Grid,
//   Chip,
//   Stack,
//   IconButton,
//   InputAdornment,
//   Divider,
//   Slider,
//   FormControl,
//   FormLabel,
//   Alert,
//   Fade,
//   Zoom,
//   Grow,
// } from '@mui/material';
// import {
//   Search as SearchIcon,
//   AutoAwesome as AutoAwesomeIcon,
//   TrendingUp as TrendingUpIcon,
//   PrecisionManufacturing as PrecisionManufacturingIcon,
//   Speed as SpeedIcon,
//   FilterAlt as FilterAltIcon,
//   Psychology as PsychologyIcon,
// } from '@mui/icons-material';

// const BookForm = ({ onSearch, disabled }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     topic: '',
//     year: new Date().getFullYear().toString(),
//     keywords: [],
//     maxResults: 50,
//   });

//   const [currentKeyword, setCurrentKeyword] = useState('');
//   const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

//   const handleChange = (field) => (event) => {
//     setFormData({ ...formData, [field]: event.target.value });
//   };

//   const handleAddKeyword = () => {
//     if (currentKeyword.trim() && !formData.keywords.includes(currentKeyword.trim())) {
//       setFormData({
//         ...formData,
//         keywords: [...formData.keywords, currentKeyword.trim()],
//       });
//       setCurrentKeyword('');
//     }
//   };

//   const handleRemoveKeyword = (keyword) => {
//     setFormData({
//       ...formData,
//       keywords: formData.keywords.filter(k => k !== keyword),
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.topic.trim() || !formData.title.trim()) {
//       return;
//     }
//     onSearch(formData);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && e.target.name !== 'keywords-input') {
//       handleAddKeyword();
//     } else if (e.key === 'Enter' && formData.topic && formData.title) {
//       handleSubmit(e);
//     }
//   };

//   return (
//     <Fade in timeout={800}>
//       <Paper
//         elevation={0}
//         sx={{
//           p: { xs: 3, md: 4 },
//           borderRadius: 4,
//           background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
//           border: '1px solid',
//           borderColor: 'grey.200',
//           backdropFilter: 'blur(20px)',
//           position: 'relative',
//           overflow: 'hidden',
//           '&::before': {
//             content: '""',
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             height: '4px',
//             background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899)',
//           },
//         }}
//       >
//         {/* Animated Background Elements */}
//         <Box
//           sx={{
//             position: 'absolute',
//             top: -50,
//             right: -50,
//             width: 200,
//             height: 200,
//             borderRadius: '50%',
//             background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 70%)',
//             zIndex: 0,
//           }}
//         />
        
//         <Box
//           sx={{
//             position: 'absolute',
//             bottom: -100,
//             left: -100,
//             width: 300,
//             height: 300,
//             borderRadius: '50%',
//             background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0) 70%)',
//             zIndex: 0,
//           }}
//         />

//         <Box sx={{ position: 'relative', zIndex: 1 }}>
//           <Box sx={{ mb: 4, textAlign: 'center' }}>
//             <Zoom in timeout={1000}>
//               <Box
//                 sx={{
//                   width: 72,
//                   height: 72,
//                   borderRadius: 4,
//                   background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   mx: 'auto',
//                   mb: 3,
//                   boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3)',
//                 }}
//               >
//                 <AutoAwesomeIcon sx={{ fontSize: 36, color: 'white' }} />
//               </Box>
//             </Zoom>
            
//             <Typography variant="h4" fontWeight={800} gutterBottom sx={{ 
//               background: 'linear-gradient(135deg, #334155 0%, #0F172A 100%)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//             }}>
//               Intelligent Research Discovery
//             </Typography>
//             <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
//               Leverage AI-powered search across 300M+ academic papers from Zenodo, OpenAlex, and more
//             </Typography>
//           </Box>

//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={3}>
//               {/* Main Topic - REQUIRED */}
//               <Grid item xs={12} md={6}>
//                 <Grow in timeout={600}>
//                   <FormControl fullWidth>
//                     <FormLabel sx={{ 
//                       mb: 1, 
//                       fontWeight: 700, 
//                       color: 'text.primary',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 1,
//                     }}>
//                       <TrendingUpIcon fontSize="small" />
//                       Research Topic *
//                     </FormLabel>
//                     <TextField
//                       placeholder="e.g., Machine Learning Ethics, Quantum Computing Applications"
//                       value={formData.topic}
//                       onChange={handleChange('topic')}
//                       required
//                       fullWidth
//                       name="topic"
//                       onKeyPress={handleKeyPress}
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <PsychologyIcon color="primary" />
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 3,
//                           backgroundColor: 'white',
//                           transition: 'all 0.3s ease',
//                           '&:hover': {
//                             boxShadow: '0 5px 15px rgba(99, 102, 241, 0.1)',
//                           },
//                           '&.Mui-focused': {
//                             boxShadow: '0 5px 20px rgba(99, 102, 241, 0.2)',
//                           },
//                         },
//                       }}
//                     />
//                     <Typography variant="caption" color="primary.main" sx={{ mt: 1, fontWeight: 500 }}>
//                       • What's the primary subject of your research?
//                     </Typography>
//                   </FormControl>
//                 </Grow>
//               </Grid>

//               {/* Title - REQUIRED */}
//               <Grid item xs={12} md={6}>
//                 <Grow in timeout={800}>
//                   <FormControl fullWidth>
//                     <FormLabel sx={{ 
//                       mb: 1, 
//                       fontWeight: 700, 
//                       color: 'text.primary',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 1,
//                     }}>
//                       <PrecisionManufacturingIcon fontSize="small" />
//                       Document Title *
//                     </FormLabel>
//                     <TextField
//                       placeholder="Enter book, paper, or project title"
//                       value={formData.title}
//                       onChange={handleChange('title')}
//                       required
//                       name="title"
//                       onKeyPress={handleKeyPress}
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <SearchIcon color="primary" />
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 3,
//                           backgroundColor: 'white',
//                           transition: 'all 0.3s ease',
//                           '&:hover': {
//                             boxShadow: '0 5px 15px rgba(99, 102, 241, 0.1)',
//                           },
//                           '&.Mui-focused': {
//                             boxShadow: '0 5px 20px rgba(99, 102, 241, 0.2)',
//                           },
//                         },
//                       }}
//                     />
//                     <Typography variant="caption" color="primary.main" sx={{ mt: 1, fontWeight: 500 }}>
//                       • Be specific for better results
//                     </Typography>
//                   </FormControl>
//                 </Grow>
//               </Grid>

//               {/* Year */}
//               <Grid item xs={12} md={4}>
//                 <FormControl fullWidth>
//                   <FormLabel sx={{ 
//                     mb: 1, 
//                     fontWeight: 700, 
//                     color: 'text.primary',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 1,
//                   }}>
//                     <SpeedIcon fontSize="small" />
//                     Publication Year
//                   </FormLabel>
//                   <TextField
//                     placeholder={new Date().getFullYear().toString()}
//                     value={formData.year}
//                     onChange={handleChange('year')}
//                     type="number"
//                     inputProps={{ min: 1900, max: new Date().getFullYear() + 5 }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 3,
//                         backgroundColor: 'white',
//                       },
//                     }}
//                   />
//                   <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
//                     Latest research or specific year
//                   </Typography>
//                 </FormControl>
//               </Grid>

//               {/* Advanced Section Toggle */}
//               <Grid item xs={12}>
//                 <Button
//                   startIcon={<FilterAltIcon />}
//                   onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
//                   sx={{
//                     color: 'primary.main',
//                     fontWeight: 600,
//                     textTransform: 'none',
//                     '&:hover': {
//                       backgroundColor: 'primary.lighter',
//                     },
//                   }}
//                 >
//                   {isAdvancedOpen ? 'Hide Advanced Options' : 'Show Advanced Options'}
//                 </Button>
//               </Grid>

//               {/* Advanced Options */}
//               {isAdvancedOpen && (
//                 <Grow in={isAdvancedOpen}>
//                   <Grid item xs={12}>
//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 3,
//                         borderRadius: 3,
//                         backgroundColor: 'grey.50',
//                         border: '1px solid',
//                         borderColor: 'grey.200',
//                       }}
//                     >
//                       <Grid container spacing={3}>
//                         {/* Keywords */}
//                         <Grid item xs={12} md={8}>
//                           <FormControl fullWidth>
//                             <FormLabel sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
//                               Specific Keywords
//                             </FormLabel>
//                             <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
//                               <TextField
//                                 placeholder="Add precision keywords (press Enter)"
//                                 value={currentKeyword}
//                                 onChange={(e) => setCurrentKeyword(e.target.value)}
//                                 onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
//                                 fullWidth
//                                 size="small"
//                                 name="keywords-input"
//                                 sx={{
//                                   '& .MuiOutlinedInput-root': {
//                                     borderRadius: 2,
//                                     backgroundColor: 'white',
//                                   },
//                                 }}
//                               />
//                               <Button
//                                 variant="outlined"
//                                 onClick={handleAddKeyword}
//                                 size="small"
//                                 sx={{ borderRadius: 2 }}
//                               >
//                                 Add
//                               </Button>
//                             </Box>
//                             {formData.keywords.length > 0 && (
//                               <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//                                 {formData.keywords.map((keyword, index) => (
//                                   <Chip
//                                     key={index}
//                                     label={keyword}
//                                     onDelete={() => handleRemoveKeyword(keyword)}
//                                     sx={{
//                                       borderRadius: 1.5,
//                                       backgroundColor: 'white',
//                                       border: '1px solid',
//                                       borderColor: 'primary.100',
//                                       fontWeight: 500,
//                                       mb: 0.5,
//                                     }}
//                                   />
//                                 ))}
//                               </Stack>
//                             )}
//                           </FormControl>
//                         </Grid>

//                         {/* Max Results */}
//                         <Grid item xs={12} md={4}>
//                           <FormControl fullWidth>
//                             <FormLabel sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
//                               Results Limit: {formData.maxResults}
//                             </FormLabel>
//                             <Slider
//                               value={formData.maxResults}
//                               onChange={handleChange('maxResults')}
//                               min={10}
//                               max={100}
//                               step={10}
//                               marks={[
//                                 { value: 10, label: '10' },
//                                 { value: 50, label: '50' },
//                                 { value: 100, label: '100' },
//                               ]}
//                               valueLabelDisplay="auto"
//                               sx={{
//                                 color: 'primary.main',
//                                 '& .MuiSlider-markLabel': {
//                                   fontSize: '0.75rem',
//                                 },
//                               }}
//                             />
//                           </FormControl>
//                         </Grid>
//                       </Grid>
//                     </Paper>
//                   </Grid>
//                 </Grow>
//               )}

//               {/* Submit Button */}
//               <Grid item xs={12}>
//                 <Box sx={{ 
//                   display: 'flex', 
//                   justifyContent: 'center', 
//                   mt: 4,
//                   position: 'relative',
//                 }}>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     size="large"
//                     disabled={disabled || !formData.topic.trim() || !formData.title.trim()}
//                     startIcon={<AutoAwesomeIcon />}
//                     sx={{
//                       px: 8,
//                       py: 2,
//                       borderRadius: 3,
//                       fontSize: '1.1rem',
//                       fontWeight: 700,
//                       minWidth: 300,
//                       background: disabled || !formData.topic.trim() || !formData.title.trim() 
//                         ? 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)' 
//                         : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
//                       boxShadow: disabled || !formData.topic.trim() || !formData.title.trim() 
//                         ? 'none' 
//                         : '0 15px 30px -10px rgba(99, 102, 241, 0.4)',
//                       transition: 'all 0.3s ease',
//                       '&:hover': {
//                         background: disabled || !formData.topic.trim() || !formData.title.trim()
//                           ? 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)'
//                           : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
//                         boxShadow: disabled || !formData.topic.trim() || !formData.title.trim()
//                           ? 'none'
//                           : '0 20px 40px -10px rgba(99, 102, 241, 0.6)',
//                         transform: 'translateY(-2px)',
//                       },
//                       '&:active': {
//                         transform: 'translateY(0)',
//                       },
//                     }}
//                   >
//                     {disabled ? 'Connecting...' : 'Discover Research Papers'}
//                   </Button>
                  
//                   {/* Animated glow effect */}
//                   {!disabled && formData.topic.trim() && formData.title.trim() && (
//                     <Box
//                       sx={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                         width: 'calc(100% + 40px)',
//                         height: 'calc(100% + 40px)',
//                         borderRadius: '20px',
//                         background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
//                         filter: 'blur(20px)',
//                         opacity: 0.3,
//                         zIndex: -1,
//                         animation: 'pulse 2s ease-in-out infinite',
//                         '@keyframes pulse': {
//                           '0%, 100%': { opacity: 0.3 },
//                           '50%': { opacity: 0.5 },
//                         },
//                       }}
//                     />
//                   )}
//                 </Box>
//               </Grid>
//             </Grid>
//           </form>

//           {/* API Status */}
//           {disabled && (
//             <Alert 
//               severity="info" 
//               sx={{ 
//                 mt: 3, 
//                 borderRadius: 2,
//                 animation: 'pulse 1.5s ease-in-out infinite',
//                 '@keyframes pulse': {
//                   '0%, 100%': { opacity: 1 },
//                   '50%': { opacity: 0.7 },
//                 },
//               }}
//             >
//               <Typography variant="body2" fontWeight={600}>
//                 🔄 Initializing connection to research database...
//               </Typography>
//             </Alert>
//           )}

//           {/* Requirements Note */}
//           <Paper
//             elevation={0}
//             sx={{
//               mt: 4,
//               p: 3,
//               borderRadius: 3,
//               backgroundColor: 'primary.50',
//               border: '1px solid',
//               borderColor: 'primary.200',
//             }}
//           >
//             <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: 'primary.800' }}>
//               🎯 Powered by Advanced Research APIs
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               <strong>Required:</strong> Both Topic and Title fields • 
//               <strong> Sources:</strong> Zenodo, OpenAlex, arXiv • 
//               <strong> Coverage:</strong> 300M+ academic papers • 
//               <strong> AI Analysis:</strong> Relevance scoring & content extraction
//             </Typography>
//           </Paper>
//         </Box>
//       </Paper>
//     </Fade>
//   );
// };

// export default BookForm;

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Chip,
  Stack,
  IconButton,
  InputAdornment,
  Divider,
  Slider,
  FormControl,
  FormLabel,
  Alert,
  Fade,
  Zoom,
  Grow,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  AutoAwesome as AutoAwesomeIcon,
  TrendingUp as TrendingUpIcon,
  PrecisionManufacturing as PrecisionManufacturingIcon,
  Speed as SpeedIcon,
  FilterAlt as FilterAltIcon,
  Psychology as PsychologyIcon,
  KeyboardReturn as KeyboardReturnIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
} from '@mui/icons-material';

const BookForm = ({ onSearch, disabled }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    year: new Date().getFullYear().toString(),
    keywords: [],
    maxResults: 50,
  });

  const [currentKeyword, setCurrentKeyword] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isFocused, setIsFocused] = useState({
    topic: false,
    title: false,
    year: false,
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleAddKeyword = () => {
    if (currentKeyword.trim() && !formData.keywords.includes(currentKeyword.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, currentKeyword.trim()],
      });
      setCurrentKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.topic.trim() || !formData.title.trim()) {
      return;
    }
    onSearch(formData);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.name === 'keywords-input') {
      e.preventDefault();
      handleAddKeyword();
    } else if (e.key === 'Enter' && formData.topic && formData.title) {
      handleSubmit(e);
    }
  };

  const handleFocus = (field) => () => {
    setIsFocused({ ...isFocused, [field]: true });
  };

  const handleBlur = (field) => () => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  return (
    <Fade in timeout={800}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5, md: 4 },
          borderRadius: { xs: 3, md: 4 },
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.grey[50], 0.95)} 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.light, 0.2),
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899, #6366F1)',
            backgroundSize: '300% 100%',
            animation: 'gradientFlow 3s ease-in-out infinite',
            '@keyframes gradientFlow': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
          },
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
            zIndex: 0,
            animation: 'float 20s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
              '25%': { transform: 'translate(20px, 20px) rotate(90deg)' },
              '50%': { transform: 'translate(0, 40px) rotate(180deg)' },
              '75%': { transform: 'translate(-20px, 20px) rotate(270deg)' },
            },
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.08)} 0%, transparent 70%)`,
            zIndex: 0,
            animation: 'floatReverse 25s ease-in-out infinite',
            '@keyframes floatReverse': {
              '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
              '25%': { transform: 'translate(-30px, -30px) rotate(-90deg)' },
              '50%': { transform: 'translate(0, -60px) rotate(-180deg)' },
              '75%': { transform: 'translate(30px, -30px) rotate(-270deg)' },
            },
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ mb: { xs: 3, md: 4 }, textAlign: 'center' }}>
            <Zoom in timeout={1000}>
              <Box
                sx={{
                  width: { xs: 60, md: 72 },
                  height: { xs: 60, md: 72 },
                  borderRadius: { xs: 3, md: 4 },
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 12px 32px rgba(99, 102, 241, 0.3)',
                  transform: 'translateY(0)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: { xs: 28, md: 36 }, color: 'white' }} />
              </Box>
            </Zoom>
            
            <Typography variant="h4" fontWeight={900} gutterBottom sx={{ 
              background: 'linear-gradient(135deg, #334155 0%, #0F172A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              lineHeight: 1.2,
              mb: 1,
            }}>
              Intelligent Research Discovery
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              opacity: 0.8,
            }}>
              Discover relevant academic papers across 300M+ sources with AI-powered precision
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={{ xs: 2.5, md: 3 }}>
              {/* Main Topic - REQUIRED */}
              <Grid item xs={12} md={6}>
                <Grow in timeout={600}>
                  <FormControl fullWidth>
                    <FormLabel sx={{ 
                      mb: 1, 
                      fontWeight: 700, 
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}>
                      <TrendingUpIcon fontSize="small" />
                      Research Topic *
                    </FormLabel>
                    <TextField
                      placeholder="e.g., Machine Learning Ethics, Quantum Computing Applications"
                      value={formData.topic}
                      onChange={handleChange('topic')}
                      onFocus={handleFocus('topic')}
                      onBlur={handleBlur('topic')}
                      required
                      fullWidth
                      name="topic"
                      onKeyPress={handleKeyPress}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PsychologyIcon color={isFocused.topic ? "primary" : "action"} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2.5,
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          transition: 'all 0.3s ease',
                          border: '1px solid',
                          borderColor: isFocused.topic 
                            ? alpha(theme.palette.primary.main, 0.5) 
                            : alpha(theme.palette.grey[300], 0.8),
                          '&:hover': {
                            borderColor: alpha(theme.palette.primary.main, 0.3),
                            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
                          },
                          '&.Mui-focused': {
                            borderColor: theme.palette.primary.main,
                            boxShadow: '0 4px 24px rgba(99, 102, 241, 0.25)',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          padding: { xs: '12px 14px', sm: '14px 16px' },
                        },
                      }}
                    />
                    <Typography variant="caption" color="primary.main" sx={{ 
                      mt: 1, 
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}>
                      <span style={{ fontSize: '1.2em' }}>•</span> What's the primary subject of your research?
                    </Typography>
                  </FormControl>
                </Grow>
              </Grid>

              {/* Title - REQUIRED */}
              <Grid item xs={12} md={6}>
                <Grow in timeout={800}>
                  <FormControl fullWidth>
                    <FormLabel sx={{ 
                      mb: 1, 
                      fontWeight: 700, 
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}>
                      <PrecisionManufacturingIcon fontSize="small" />
                      Document Title *
                    </FormLabel>
                    <TextField
                      placeholder="Enter book, paper, or project title"
                      value={formData.title}
                      onChange={handleChange('title')}
                      onFocus={handleFocus('title')}
                      onBlur={handleBlur('title')}
                      required
                      name="title"
                      onKeyPress={handleKeyPress}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color={isFocused.title ? "primary" : "action"} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <Tooltip title="Press Enter to search">
                            <InputAdornment position="end">
                              <KeyboardReturnIcon 
                                sx={{ 
                                  color: isFocused.title ? theme.palette.primary.main : theme.palette.grey[400],
                                  cursor: 'pointer',
                                }} 
                              />
                            </InputAdornment>
                          </Tooltip>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2.5,
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          transition: 'all 0.3s ease',
                          border: '1px solid',
                          borderColor: isFocused.title 
                            ? alpha(theme.palette.primary.main, 0.5) 
                            : alpha(theme.palette.grey[300], 0.8),
                          '&:hover': {
                            borderColor: alpha(theme.palette.primary.main, 0.3),
                            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
                          },
                          '&.Mui-focused': {
                            borderColor: theme.palette.primary.main,
                            boxShadow: '0 4px 24px rgba(99, 102, 241, 0.25)',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          padding: { xs: '12px 14px', sm: '14px 16px' },
                        },
                      }}
                    />
                    <Typography variant="caption" color="primary.main" sx={{ 
                      mt: 1, 
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}>
                      <span style={{ fontSize: '1.2em' }}>•</span> Be specific for better results
                    </Typography>
                  </FormControl>
                </Grow>
              </Grid>

              {/* Year */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <FormLabel sx={{ 
                    mb: 1, 
                    fontWeight: 700, 
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}>
                    <SpeedIcon fontSize="small" />
                    Publication Year
                  </FormLabel>
                  <TextField
                    placeholder={new Date().getFullYear().toString()}
                    value={formData.year}
                    onChange={handleChange('year')}
                    onFocus={handleFocus('year')}
                    onBlur={handleBlur('year')}
                    type="number"
                    inputProps={{ 
                      min: 1900, 
                      max: new Date().getFullYear() + 5,
                      style: { fontSize: theme.typography.fontSize }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        border: '1px solid',
                        borderColor: isFocused.year 
                          ? alpha(theme.palette.primary.main, 0.5) 
                          : alpha(theme.palette.grey[300], 0.8),
                        '&:hover': {
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                        },
                        '&.Mui-focused': {
                          borderColor: theme.palette.primary.main,
                          boxShadow: '0 4px 24px rgba(99, 102, 241, 0.25)',
                        },
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    mt: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}>
                    <span style={{ fontSize: '1.2em' }}>•</span> Latest research or specific year
                  </Typography>
                </FormControl>
              </Grid>

              {/* Advanced Section Toggle */}
              <Grid item xs={12}>
                <Button
                  startIcon={<FilterAltIcon />}
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                    backgroundColor: alpha(theme.palette.primary.light, 0.1),
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.light, 0.2),
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                    },
                  }}
                >
                  {isAdvancedOpen ? 'Hide Advanced Options' : 'Show Advanced Options'}
                </Button>
              </Grid>

              {/* Advanced Options */}
              {isAdvancedOpen && (
                <Grow in={isAdvancedOpen}>
                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.grey[50], 0.8),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.light, 0.2),
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Grid container spacing={3}>
                        {/* Keywords */}
                        <Grid item xs={12} md={8}>
                          <FormControl fullWidth>
                            <FormLabel sx={{ 
                              mb: 1, 
                              fontWeight: 600, 
                              color: 'text.primary',
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                            }}>
                              Specific Keywords
                            </FormLabel>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              <TextField
                                placeholder="Add precision keywords (press Enter)"
                                value={currentKeyword}
                                onChange={(e) => setCurrentKeyword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                                fullWidth
                                size="small"
                                name="keywords-input"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <Tooltip title="Add keyword">
                                        <IconButton
                                          onClick={handleAddKeyword}
                                          size="small"
                                          sx={{ 
                                            color: theme.palette.primary.main,
                                            '&:hover': {
                                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                            },
                                          }}
                                        >
                                          <AddCircleIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: 'white',
                                  },
                                }}
                              />
                            </Box>
                            {formData.keywords.length > 0 && (
                              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {formData.keywords.map((keyword, index) => (
                                  <Chip
                                    key={index}
                                    label={keyword}
                                    onDelete={() => handleRemoveKeyword(keyword)}
                                    deleteIcon={
                                      <Tooltip title="Remove keyword">
                                        <RemoveCircleIcon />
                                      </Tooltip>
                                    }
                                    size="small"
                                    sx={{
                                      borderRadius: 1.5,
                                      backgroundColor: 'white',
                                      border: '1px solid',
                                      borderColor: theme.palette.primary.light,
                                      fontWeight: 500,
                                      mb: 0.5,
                                      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                                      '& .MuiChip-deleteIcon': {
                                        color: theme.palette.error.main,
                                        '&:hover': {
                                          color: theme.palette.error.dark,
                                        },
                                      },
                                    }}
                                  />
                                ))}
                              </Stack>
                            )}
                          </FormControl>
                        </Grid>

                        {/* Max Results */}
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth>
                            <FormLabel sx={{ 
                              mb: 1, 
                              fontWeight: 600, 
                              color: 'text.primary',
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                            }}>
                              Results Limit: {formData.maxResults}
                            </FormLabel>
                            <Slider
                              value={formData.maxResults}
                              onChange={handleChange('maxResults')}
                              min={10}
                              max={100}
                              step={10}
                              marks={[
                                { value: 10, label: '10' },
                                { value: 50, label: '50' },
                                { value: 100, label: '100' },
                              ]}
                              valueLabelDisplay="auto"
                              sx={{
                                color: theme.palette.primary.main,
                                '& .MuiSlider-markLabel': {
                                  fontSize: '0.75rem',
                                },
                                '& .MuiSlider-valueLabel': {
                                  backgroundColor: theme.palette.primary.main,
                                  borderRadius: 1,
                                },
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grow>
              )}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 4,
                  width: '100%',
                  position: 'relative',
                }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={disabled || !formData.topic.trim() || !formData.title.trim()}
                    startIcon={<AutoAwesomeIcon />}
                    sx={{
                      px: { xs: 6, sm: 8 },
                      py: { xs: 1.5, sm: 2 },
                      borderRadius: 3,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 700,
                      minWidth: { xs: '100%', sm: 300 },
                      width: { xs: '100%', sm: 'auto' },
                      background: disabled || !formData.topic.trim() || !formData.title.trim() 
                        ? 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)' 
                        : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                      boxShadow: disabled || !formData.topic.trim() || !formData.title.trim() 
                        ? 'none' 
                        : '0 8px 32px rgba(99, 102, 241, 0.4)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: disabled || !formData.topic.trim() || !formData.title.trim()
                          ? 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)'
                          : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                        boxShadow: disabled || !formData.topic.trim() || !formData.title.trim()
                          ? 'none'
                          : '0 12px 48px rgba(99, 102, 241, 0.6)',
                        transform: 'translateY(-3px) scale(1.02)',
                      },
                      '&:active': {
                        transform: 'translateY(0) scale(1)',
                      },
                    }}
                  >
                    {disabled ? 'Connecting...' : 'Discover Research Papers'}
                  </Button>
                  
                  {/* Animated glow effect */}
                  {!disabled && formData.topic.trim() && formData.title.trim() && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 'calc(100% + 20px)', sm: 'calc(100% + 40px)' },
                        height: { xs: 'calc(100% + 20px)', sm: 'calc(100% + 40px)' },
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899, #6366F1)',
                        backgroundSize: '300% 100%',
                        filter: 'blur(20px)',
                        opacity: 0.3,
                        zIndex: -1,
                        animation: 'pulse 2s ease-in-out infinite, gradientFlow 3s ease-in-out infinite',
                      }}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>

          {/* API Status */}
          {disabled && (
            <Alert 
              severity="info" 
              sx={{ 
                mt: 3, 
                borderRadius: 2,
                animation: 'pulse 1.5s ease-in-out infinite',
                backgroundColor: alpha(theme.palette.info.light, 0.1),
                border: '1px solid',
                borderColor: alpha(theme.palette.info.main, 0.2),
              }}
              icon={<AutoAwesomeIcon />}
            >
              <Typography variant="body2" fontWeight={600}>
                🔄 Connecting to research database...
              </Typography>
            </Alert>
          )}

          {/* Requirements Note */}
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: { xs: 2.5, sm: 3 },
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.primary.light, 0.08),
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.light, 0.3),
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}
              >
                ⚡
              </Box>
              <Typography variant="subtitle2" fontWeight={800} sx={{ color: 'primary.800' }}>
                Powered by Advanced Research APIs
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.5, sm: 2 }} flexWrap="wrap">
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span style={{ color: theme.palette.success.main, fontWeight: 700 }}>✓</span>
                <strong>Required:</strong> Both Topic and Title fields
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span style={{ color: theme.palette.primary.main, fontWeight: 700 }}>⚡</span>
                <strong>Sources:</strong> Zenodo, OpenAlex, arXiv
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span style={{ color: theme.palette.warning.main, fontWeight: 700 }}>📊</span>
                <strong>Coverage:</strong> 300M+ academic papers
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span style={{ color: theme.palette.info.main, fontWeight: 700 }}>🤖</span>
                <strong>AI Analysis:</strong> Relevance scoring
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Paper>
    </Fade>
  );
};

export default BookForm;
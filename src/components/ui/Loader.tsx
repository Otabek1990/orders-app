import { Box, CircularProgress } from '@mui/material'

function Loader() {
  return (
    <Box width={"100%"} display={"flex"} justifyContent={"center"} >
        <CircularProgress />
    </Box>
  )
}

export default Loader
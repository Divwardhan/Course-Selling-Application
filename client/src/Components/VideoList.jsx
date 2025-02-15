import { Box, List, Typography ,ListItem ,Button} from '@mui/material'
import axios from 'axios'
import React from 'react'
import { useEffect , useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
const VideoList = () => {
    const {id} = useParams()
    const title = decodeURIComponent(id)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const [VideoList, setVideoList] = useState([])

    useEffect(function () {
      const fetchData=async function(){
        try{
          const response = await axios.get(
            'http://localhost:3000/api/v1/user/purchases',
            {
              headers: {
                token: token,
              },
            }
          );
          const courses = response.data.courses
          const focus = courses.find(course => course.title === title)
          setVideoList(focus.videos);

      }
      catch(err){
        console.log(err)
      }
        
    }
    fetchData()
    }
    , [token ,title])

    function tovideo(video){
      console.log(video)
        navigate(`/purchases/${title}/${video+'.mp4'}`) 
    }
    

  return (
    <Box>
        <Typography variant="h5" gutterBottom sx={{ color: '#333' }}>
            {title}
        </Typography>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {VideoList.map(function(video , index){
                return <ListItem key={index}><Button onClick={function(){tovideo(video)}}>{video} </Button></ListItem>
            })}
        </List>
    </Box>
  )
}

export default VideoList

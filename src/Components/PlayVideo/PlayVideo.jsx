import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import simon from '../../assets/simon.png'
import profile from '../../assets/profile.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment/moment'
import { useParams } from 'react-router-dom'

const PlayVideo = () => {
  // console.log("VideoId: "+videoId);

 const {videoId} = useParams();

    const [apiData, setApiData] = useState(null)
   const [channelData, setChannelData] =  useState(null)
   const [commentData, setCommentData] = useState([])

    const fetchVideoData = async ()=>{
        const videoDetail_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;

       await fetch(videoDetail_url).then(res=>res.json()).then(data=>setApiData(data.items[0]));
    }

    const fetchOtherData = async ()=>{
      const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
    
     await fetch(channelData_url).then(res=>res.json()).then(data=>setChannelData(data.items[0]))
    
       const comment_url =  await fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`);

       const data = await comment_url.json()
       if(!comment_url.ok) throw("somthing went wrong")
       setCommentData(data.items)

       console.log("hdhsgdhsgdhsgdhs: "+data.items)
      
      }

  

    useEffect(()=>{
        fetchVideoData();
    },[videoId])

    useEffect(()=>{
      fetchOtherData();
    },[apiData])

  return (
    <div className='play-video'>
        {/* <video src={video1} controls autoplay loop muted></video> */}
        
       { <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>}
        <h3>{apiData?apiData?.snippet?.title:"Title Here"}</h3>
       <div className="play-video-info">
        <p>{apiData?value_converter(apiData?.statistics?.viewCount):"16K"} Views &bull; {moment(apiData?.snippet?.publishedAt).fromNow()}</p>
        <div>
          <span><img src={like} alt="" />{apiData?value_converter(apiData.statistics.likeCount):155}</span>
          <span><img src={dislike} alt="" /></span>
          <span><img src={share} alt="" />Share</span>
          <span><img src={save} alt="" />Save</span>
        </div>
       </div>
       <hr />
       <div className="publisher">
          <img src={channelData?channelData.snippet.thumbnails.default.url:""} alt="" />
          <div>
            <p>{apiData?apiData.snippet.channelTitle:""}</p>
            <span>{channelData?value_converter(channelData.statistics.subscriberCount):"1M"} Subscribers</span>
          </div>
          <button>Subscribe</button>
       </div>
       <div className='video-description'>
        <p>{apiData?apiData.snippet.description.slice(0,250):"Description Here"}</p>
        <hr />
        <h4>{apiData?value_converter(apiData.statistics.commentCount):102} Comments</h4>



 <div className='comment'>
            {commentData?.map((item, index)=>{
              return(
                <div className='comment-main-div'>
                  <img src={item?.snippet?.topLevelComment?.snippet?.authorProfileImageUrl} alt="" />
                <div className='text-content'>
                <h3>{item?.snippet?.topLevelComment?.snippet?.authorDisplayName}</h3>
                <p>{item?.snippet?.topLevelComment?.snippet?.textDisplay}</p>
                <div className='comment-action'>
                <img src={like} alt="" />
                <span>{value_converter(item?.snippet?.topLevelComment?.snippet?.likeCount)}</span>
                <img src={dislike} alt="" />
                </div>
                </div>
              </div> 
              )
            })}
         
            </div>


        </div>

           
      
    </div>
   
  )
}



export default PlayVideo

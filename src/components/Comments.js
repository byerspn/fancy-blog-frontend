
import { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { APIURL } from '../config.js';

import NewComment from './NewComment.js'


const Comments = ({match}) => {

  const [error, setError] = useState(false)
  const [post, setPost] = useState(null)
  const [newComment, setNewComment] = useState(false)
  const [postDeleted, setPostDeleted] = useState(false)

  function likePost () {
    let updatedPost = post
    updatedPost.likes = updatedPost.likes + 1
    fetch(`${APIURL}/${post._id}`, {
      method: 'PUT', // put updates all keys in object
      mode: 'cors', // cors
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(updatedPost)
    })
      .then(response => response.json())
      .then(responseJSON => {
        setPost(responseJSON)
        // console.log('Post successfully updated: ',responseJSON)  //log it cus why not
      })
      .catch((error) => {console.error('There was an issue updating the post: ', error)})
  }
  function dislikePost () {
    if ((post.likes + post.dislikes > 10) && (post.dislikes > post.likes * 2)) {
      fetch(`${APIURL}/${post._id}`, {
        method: 'DELETE', // put updates all keys in object
        mode: 'cors' // cors
      })
        .then(response => response.json())
        .then(responseJSON => {
          // console.log('Post successfully deleted: ',responseJSON)  //log it cus why not
          setPostDeleted(true)
        })
        .catch((error) => {console.error('There was an issue updating the post: ', error)})
    } else {
      let updatedPost = post
      updatedPost.dislikes = updatedPost.dislikes + 1
      fetch(`${APIURL}/${post._id}`, {
        method: 'PUT', // put updates all keys in object
      mode: 'cors', // cors
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
        },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(updatedPost)
      })
        .then(response => response.json())
        .then(responseJSON => {
          setPost(responseJSON)
          // console.log('Post successfully updated: ',responseJSON)  //log it cus why not
        })
        .catch((error) => {console.error('There was an issue updating the post: ', error)})
    }
  }

  useEffect(() => {
    const url = `${APIURL}/${match.params.id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch(() => {
        setError(true)
      })
  }, [match.params.id])

  const handleComment = () => {
    setNewComment(true)
  }

  if (error) {
    return <div>There was a problem getting the data.</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  if (postDeleted) {
    return (
      <div>
        <p>This post has been deleted for having too poor of a like:dislike ratio.</p>
        <Link to="/"><p>Return home</p></Link>
      </div>
    )
  }

  return (
    <div>
      <p>{post.text}</p>
      <p>Likes: {post.likes}</p>
      <p>Dislikes: {post.dislikes}</p>
      <ul>
        {post.comments.map((comment, idx) => (
          <li key={idx}>{comment}</li>
        ))}
      </ul>
      <div>
        <button>likes</button>
        <button>dislikes</button>
        <button onClick={likePost} >like</button>
        <button onClick={dislikePost} >dislike</button>
        <button onClick={handleComment}>New Comment</button>
        {!newComment ? null : <NewComment post={post} />}
      </div>
    </div>
  );
};

export default Comments;
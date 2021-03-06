import { useState, useEffect } from "react";
import { APIURL } from "../config.js";

// Components
import NewComment from "./NewComment.js";
import Buttons from "./Buttons.js";

// Style
import { 
  Button, 
  Card, 
  Container, 
  ButtonToolbar, 
  ButtonGroup, 
  ListGroup, 
  ListGroupItem
} from "react-bootstrap";

const Comments = ({ match, posts, setPosts }) => {

  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState(false);
  const [title, setTitle] = useState('')

  useEffect(() => {
    const url = `${APIURL}/${match.params.id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPost(data)
        let text = data.text.split(" ")
        let randomIdx = Math.floor(Math.random() * text.length)
        let title = `${text[0]} ${text[randomIdx]} ${text[text.length-1]}` 
        setTitle(title)
        })
      .catch(() => {
        setError(true);
      });
  }, [match.params.id]);

  if (error) {
    return <div>There was a problem getting the data.</div>;
  };

  if (!post) {
    return (
    <Container fluid>
      <Card className="mt-3 mb-3 shadow">
        <Card.Body>
          <Card.Text className="fs-5 text-center" >This post does not exist. It may have been deleted for being nayed too much.</Card.Text>
        </Card.Body>
      </Card>
    </Container>
    )
  };

  return (
    <Container fluid>
      <Card className="mt-3 mb-3 shadow">
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text className="fs-5" >{post.text}</Card.Text>
          <ButtonToolbar className="d-flex justify-content-around">
            <ButtonGroup>
              <Button 
                variant="outline-info" 
                className="mb-3" 
                onClick= {() => setNewComment(!newComment)}
              >
                New Comment
              </Button>
            </ButtonGroup>
            <Buttons 
              post={post} 
              posts={posts} 
              setPosts={setPosts} 
              setPost={setPost}
            />
          </ButtonToolbar>
          {!newComment ? null : <NewComment post={post} setPost={setPost} setNewComment={setNewComment} />}
          <hr />
          <Card.Title className="text-center">Comments </Card.Title>
          <ListGroup className="list-group-flush">
            {post.comments.map((comment, idx) => (
              <ListGroupItem key={idx}>{comment}</ListGroupItem>
            ))}
          </ListGroup>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end">{`Created: ${post.createdAt}`}</Card.Footer>
      </Card>
    </Container>
  );
};

export default Comments;

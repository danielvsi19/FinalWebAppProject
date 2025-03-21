import { Card, Container, Row, Col } from 'react-bootstrap';
import { useContext, useEffect } from 'react';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import ScaleLoader from 'react-spinners/ScaleLoader';

const UserPage: React.FC = () => {
    const authContext = useContext<AuthContextType | undefined>(AuthContext);

    useEffect(() => {
        
    }, []);

    if (!authContext || !authContext.user) {
        return <ScaleLoader color="black" />;
    }

    const { username, email, profilePicture } = authContext.user;
    console.log("user", authContext.user);

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card style={{ width: '70%' }}>
                <Row noGutters>
                    <Col md={4}>
                        <Card.Img variant="top" src={profilePicture} />
                    </Col>
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title>{username}</Card.Title>
                            <Card.Text>{email}</Card.Text>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export { UserPage };
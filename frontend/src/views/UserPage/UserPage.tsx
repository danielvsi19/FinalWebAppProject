import { Card, Container, Row, Col } from 'react-bootstrap';
import { useContext, useEffect } from 'react';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import ScaleLoader from 'react-spinners/ScaleLoader';

const UserPage: React.FC = () => {
    const authContext = useContext<AuthContextType | undefined>(AuthContext);

    useEffect(() => {
        // Fetch user details and posts
        const fetchUserData = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userId = JSON.parse(storedUser)._id;
                const response = await api.getUser(userId);
                if (response && response.data) {
                    const userData = response.data;
                    setUser(userData);
                    setUsername(userData.username);
                    setProfilePicture(userData.profilePicture || '');
                    setPosts(userData.posts);
                }
            }
        };
        fetchUserData();
    }, []);

    if (!authContext || !authContext.user) {
        return <ScaleLoader color="black" />;
    }

    const handleSave = async () => {
        if (user) {
            // Update user details
            const formData = new FormData();
            formData.append('username', username);
            if (profilePictureFile) {
                formData.append('profilePicture', profilePictureFile);
            }

            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userId = JSON.parse(storedUser)._id;
                await api.updateUser(userId, formData);
                setIsEditing(false);
            }
        }
    };

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePictureFile(e.target.files[0]);
            setProfilePicture(URL.createObjectURL(e.target.files[0]));
        }
    };

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
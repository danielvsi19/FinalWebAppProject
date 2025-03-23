import { Card, Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import ScaleLoader from 'react-spinners/ScaleLoader';
import api from '../../api/api';
import './UserPage.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UserPage: React.FC = () => {
    const authContext = useContext<AuthContextType | undefined>(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (authContext?.user) {
            setUsername(authContext.user.username);
            setPreview(`${BACKEND_URL}/${authContext.user.profilePicture}`);
        }
    }, [authContext]);

    if (!authContext || !authContext.user) {
        return <ScaleLoader color="black" />;
    }

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset to original values
        if (authContext?.user) {
            setUsername(authContext.user.username);
            setPreview(`${BACKEND_URL}/${authContext.user.profilePicture}`);
        }
        setProfilePicture(null);
    };

    const handleSave = async () => {
        if (authContext.user) {
            try {
                const formData = new FormData();
                formData.append('username', username);
                if (profilePicture) {
                    formData.append('profilePicture', profilePicture);
                }
    
                const response = await api.updateUser(authContext.user._id, formData);
                if (response && response.data) {
                    const updatedUser = response.data.data; // Access the data property
                    authContext.setUser(updatedUser);
                    setIsEditing(false);
                    setUsername(updatedUser.username);
                    setPreview(
                        updatedUser.profilePicture 
                            ? `${BACKEND_URL}/${updatedUser.profilePicture}`
                            : `${BACKEND_URL}/uploads/default-profile.png`
                    );
                } else {
                    console.error('No data received from API');
                }
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    };

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card className="user-card">
                <Row className="g-0">
                    <Col md={4} className="d-flex align-items-center justify-content-center p-4">
                        <div className="profile-image-container position-relative">
                            <Card.Img
                                className="profile-image"
                                src={preview}
                                alt="Profile"
                            />
                        </div>
                    </Col>
                    <Col md={8}>
                        <Card.Body className="p-4">
                            {isEditing ? (
                                <Form>
                                    <Form.Group controlId="formUsername" className="mb-4">
                                        <Form.Label className="fw-bold">Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="shadow-sm"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formProfilePicture" className="mb-4">
                                        <Form.Label className="fw-bold">Profile Picture</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={handleProfilePictureChange}
                                            className="shadow-sm"
                                        />
                                    </Form.Group>
                                    <div className="d-flex gap-2">
                                        <Button 
                                            variant="primary" 
                                            onClick={handleSave}
                                            className="px-4"
                                        >
                                            Save Changes
                                        </Button>
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={handleCancel}
                                            className="px-4"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </Form>
                            ) : (
                                <div className="text-center text-md-start">
                                    <Card.Title className="username-title display-6 mb-3">
                                        {authContext.user.username}
                                    </Card.Title>
                                    <Card.Text className="user-email text-muted mb-4">
                                        {authContext.user.email}
                                    </Card.Text>
                                    <Button 
                                        variant="primary" 
                                        onClick={handleEdit}
                                        className="edit-button px-4 py-2"
                                    >
                                        Edit Profile
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export { UserPage };
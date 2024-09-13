import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  background: #D6CDF6;
  color: white;
  min-height: 100vh;
  padding: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const Avatar = styled.img`
  border-radius: 50%;
  width: 120px;
  height: 120px;
  border: 4px solid white;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
`;

const Button = styled.button`
  background: white;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  margin-top: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ffe0de;
  }
`;

const Section = styled.div`
  width: 90%;
  max-width: 600px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin: 15px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

const SectionTitle = styled.h3`
  margin-bottom: 15px;
  color: black;
  font-size: 18px;
  border-bottom: 2px solid grey;
  padding-bottom: 5px;
`;

const Item = styled.div`
  background: #f9f9f9;
  color: #333;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: #f1f1f1;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
`;

const UploadLabel = styled.label`
  cursor: pointer;
  color: #333;
  margin-top: 10px;
  padding: 10px 20px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  text-align: center;
  background-color: #fff;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [validUrls, setValidUrls] = useState([]);

  const [error,setError] = useState('');

  const fetchScrapBuyerProfile = async () => {
    try {
      const scrapBuyerId = localStorage.getItem('scrapBuyerId');
      if (!scrapBuyerId) {
        throw new Error('Scrap Buyer ID not found in local storage.');
      }

      const response = await axios.get(`https://recycle-backend-apao.onrender.com/api/scrap-buyers/${scrapBuyerId}`);
      setProfileData(response.data);
      // Initialize editData with profileData only when entering edit mode
      if (isEditing) {
        setEditData(response.data);
      }
    } catch (error) {
      console.error('Error fetching scrap buyer data:', error);
    }
  };

  useEffect(() => {
    fetchScrapBuyerProfile();
    const intervalId = setInterval(fetchScrapBuyerProfile, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const handleEditToggle = () => {
    if (!isEditing) {
      // Entering edit mode
      setEditData(profileData);
    } else {
      // Exiting edit mode
      setEditData(null); // Reset editData to prevent incorrect data
    }
    setIsEditing(!isEditing);
  };

  const handlePhotoUpload = (files) => {
    setUploadedImages([]);
    const file = files[0]; // Get the first file only
    if (file) {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file)
      });
      setUploadedImages([fileWithPreview]); // Store the single file in state
    }
  };

  const uploadImagesToS3 = async () => {
    if (uploadedImages.length === 0) {
      alert('No images to upload.');
      return;
    }
  
    const file = uploadedImages[0]; // Get the first (and only) file
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const response = await axios.post('https://recycle-backend-apao.onrender.com/upload', formData);
      const imageUrl = response.data.imageUrl;
      console.log('uploaded..',imageUrl);
      return imageUrl
    } catch (error) {
      console.error('Error uploading the file', error);
      setError('Failed to upload image.');
    }
  
    setUploadedImages([]); // Clear the uploaded images state
  };


    

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
        const imageUrl = await uploadImagesToS3();

        const updatedData = {
            ...editData,
            profileImage: imageUrl,
        };
        console.log('Updated Data:', updatedData);

        const scrapBuyerId = localStorage.getItem('scrapBuyerId');
        await axios.put(`https://recycle-backend-apao.onrender.com/api/scrap-buyers/${scrapBuyerId}`, updatedData);
      fetchScrapBuyerProfile();
      setIsEditing(false); // Exit edit mode
      setEditData(null); // Clear editData
      setValidUrls([]);
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
  };

  const handleCancel = () => {
    setEditData(profileData); // Revert to original data
    setIsEditing(false); // Exit edit mode
  };

  if (!profileData) {
    return <p>Loading profile data...</p>;
  }

  return (
    <Container>
      <ProfileHeader>
        <Avatar src={isEditing && editData.profileImage ? editData.profileImage : profileData.profileImage || 'https://placeimg.com/100/100/people'} alt="Profile Avatar" />
        {isEditing && (
          <>
            <Input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={(e) => handlePhotoUpload(e.target.files)}
            />
            <UploadLabel htmlFor="file-input">Upload New Avatar</UploadLabel>
          </>
        )}
        <Button onClick={handleEditToggle}>
          {isEditing ? 'Change Picture' : 'Edit Profile'}
        </Button>
      </ProfileHeader>

      <Section>
        <SectionTitle>Basic Information</SectionTitle>
        {isEditing ? (
          <>
            <Input
              type="text"
              name="name"
              value={editData.name || ''}
              onChange={handleChange}
              placeholder="Name"
            />
            <Input
              type="text"
              name="businessName"
              value={editData.businessName || ''}
              onChange={handleChange}
              placeholder="Business Name"
            />
            <Input
              type="text"
              name="phone"
              value={editData.contact?.phone || ''}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  contact: { ...editData.contact, phone: e.target.value },
                })
              }
              placeholder="Phone"
            />
            <Input
              type="email"
              name="email"
              value={editData.contact?.email || ''}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  contact: { ...editData.contact, email: e.target.value },
                })
              }
              placeholder="Email"
            />
          </>
        ) : (
          <>
            <Item>Name: {profileData.name}</Item>
            <Item>Business Name: {profileData.businessName}</Item>
            <Item>Phone: {profileData.contact.phone}</Item>
            <Item>Email: {profileData.contact.email}</Item>
          </>
        )}
      </Section>

      <Section>
        <SectionTitle>Service Areas</SectionTitle>
        {isEditing ? (
          editData.serviceAreas.map((area, index) => (
            <Input
              key={index}
              type="text"
              value={area || ''}
              onChange={(e) => {
                const updatedAreas = [...editData.serviceAreas];
                updatedAreas[index] = e.target.value;
                setEditData({ ...editData, serviceAreas: updatedAreas });
              }}
            />
          ))
        ) : (
          profileData.serviceAreas.map((area, index) => <Item key={index}>{area}</Item>)
        )}
      </Section>

      <Section>
        <SectionTitle>Operational Details</SectionTitle>
        {isEditing ? (
          <>
            <Input
              type="text"
              name="operationalHours"
              value={editData.operationalHours || ''}
              onChange={handleChange}
              placeholder="Operational Hours"
            />
            <Input
              type="checkbox"
              checked={editData.availableStatus || false}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  availableStatus: e.target.checked,
                })
              }
            />{' '}
            Available
          </>
        ) : (
          <>
            <Item>Operational Hours: {profileData.operationalHours}</Item>
            <Item>Available: {profileData.availableStatus ? 'Yes' : 'No'}</Item>
          </>
        )}
      </Section>

      {isEditing && (
        <>
          <Button onClick={handleUpdate} style={{ marginTop: '20px' }}>
            Update
          </Button>
          <Button onClick={handleCancel} style={{ marginTop: '20px', backgroundColor: '#ffe0de' }}>
            Cancel
          </Button>
        </>
      )}
    </Container>
  );
};

export default Profile;

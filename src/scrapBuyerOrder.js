import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SellYourRecyclables = ({ t }) => {
  const [offerDetails, setOfferDetails] = useState({
    materialType: '',
    quantity: '',
    price: '',
    location: '',
    description: '',
    photos: [],
    contactInfo: '',
  });

  const [errors, setErrors] = useState({});
  const [postedOffers, setPostedOffers] = useState([]);

  const [uploadedImages, setUploadedImages] = useState([]);
  const [validUrls, setValidUrls] = useState([]);
  const [error, setError] = useState('');


  const scrapBuyerId = localStorage.getItem('scrapBuyerId');



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfferDetails({
      ...offerDetails,
      [name]: value,
    });
    setErrors({ ...errors, [name]: '' });
  };

  const handlePhotoUpload = (files) => {
    const acceptedFilesArray = Array.from(files); // Convert FileList to Array
    const filesWithPreview = acceptedFilesArray.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setUploadedImages(prevImages => [...prevImages, ...filesWithPreview]);
  };
  

  const uploadImagesToS3 = async () => {
    if (uploadedImages.length === 0) {
      alert('No images to upload.');
      return;
    }
    const uploadPromises = uploadedImages.map(async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await axios.post('https://recycle-backend-lflh.onrender.com/upload', formData);
        return response.data.imageUrl;
      } catch (error) {
        console.error('Error uploading the file', error);
        return null;
      }
    });
    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter(url => url !== null);
    if (validUrls.length === 0) {
      setError('Failed to upload images.');
      return;
    }
    setValidUrls(validUrls);
    console.log('validUrls',validUrls);
    setUploadedImages([]);
    setOfferDetails(prevDetails => ({
      ...prevDetails,
      photos: [...prevDetails.photos, ...validUrls],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!offerDetails.materialType) newErrors.materialType = 'Material Type is required';
    if (!offerDetails.quantity) newErrors.quantity = 'Quantity is required';
    if (!offerDetails.price) newErrors.price = 'Price per Unit is required';
    if (!offerDetails.location) newErrors.location = 'Location is required';
    if (!offerDetails.description) newErrors.description = 'Description is required';
    if (!offerDetails.contactInfo) newErrors.contactInfo = 'Contact Information is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    // Construct the offer details as a plain JSON object
    const newOffer = {
        materialType: offerDetails.materialType,
        quantityAvailable: offerDetails.quantity,
        pricePerUnit: offerDetails.price,
        location: {
          address: offerDetails.location,
          latitude: offerDetails.latitude || null,
          longitude: offerDetails.longitude || null,
        },
        description: offerDetails.description,
        images: offerDetails.photos,
        contactInfo: offerDetails.contactInfo,
      };
  
    console.log('newOffer', newOffer);
  
    try {
      const response = await axios.post(`https://recycle-backend-lflh.onrender.com/scrap-buyer/${scrapBuyerId}/post-offer`, newOffer, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      alert(response.data.message);
      fetchPostedOffers(); // Refresh the list of posted offers
    } catch (error) {
      console.error('There was an error posting the offer:', error);
    }
  };
  

  const fetchPostedOffers = async () => {
    try {
      const response = await axios.get(`https://recycle-backend-lflh.onrender.com/scrap-buyer/${scrapBuyerId}/posted-offers`);
      console.log('result..',response.data);
      setPostedOffers(response.data);
    } catch (error) {
      console.error('There was an error fetching the posted offers:', error);
    }
  };

  useEffect(() => {
    fetchPostedOffers(); // Fetch posted offers when the component mounts
  }, []);

  const styles = {
    sellRecyclablesContainer: {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      backgroundColor: '#f7f7f7',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      maxWidth: '900px',
      margin: 'auto',
      fontFamily: "'Roboto', sans-serif",
    },
    sectionTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '20px',
      textAlign: 'center',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontSize: '16px',
      color: '#555',
      marginBottom: '8px',
    },
    input: {
      padding: '10px',
      fontSize: '16px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      backgroundColor: '#fff',
      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    errorMessage: {
      color: 'red',
      fontSize: '14px',
      marginTop: '5px',
    },
    previewContainer: {
      marginTop: '40px',
      padding: '20px',
      borderRadius: '10px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    previewTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '20px',
      textAlign: 'center',
    },
    postedOffer: {
      padding: '15px',
      borderBottom: '1px solid #ddd',
      marginBottom: '10px',
    },


    sellRecyclablesContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        backgroundColor: '#f7f7f7',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '900px',
        margin: 'auto',
        fontFamily: "'Roboto', sans-serif",
      },
      sectionTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center',
      },
      formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      },
      formGroup: {
        display: 'flex',
        flexDirection: 'column',
      },
      label: {
        fontSize: '16px',
        color: '#555',
        marginBottom: '8px',
      },
      input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        backgroundColor: '#fff',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      },
      errorMessage: {
        color: 'red',
        fontSize: '14px',
        marginTop: '5px',
      },
      uploadButton: {
        padding: '10px 15px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#fff',
        backgroundColor: '#007bff',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
      },
      submitButton: {
        padding: '15px 20px',
        fontSize: '18px',
        fontWeight: '600',
        color: '#fff',
        backgroundColor: '#28a745',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      },

      postedOffer: {
        padding: '15px',
        borderBottom: '1px solid #ddd',
        marginBottom: '10px',
      },
      imageContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '10px',
      },
      image: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '5px',
      },
  };

  return (
    <div style={styles.sellRecyclablesContainer}>
      <h2 style={styles.sectionTitle}>{t('Post Your Scrap/Recyclable Deals')}</h2>
      <form onSubmit={handleSubmit} style={styles.formContainer}>
        <div style={styles.formGroup}>
          <label style={styles.label}>{t('Material Type')}</label>
          <select
            name="materialType"
            value={offerDetails.materialType}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">{t('Select Material Type')}</option>
            <option value="Metals">{t('Metals')}</option>
            <option value="Plastics">{t('Plastics')}</option>
            <option value="Paper">{t('Paper')}</option>
            <option value="Electronics">{t('Electronics')}</option>
          </select>
          {errors.materialType && <p style={styles.errorMessage}>{errors.materialType}</p>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>{t('Quantity Available')}</label>
          <input
            type="number"
            name="quantity"
            value={offerDetails.quantity}
            onChange={handleInputChange}
            style={styles.input}
            placeholder={t('e.g., kilograms(KGs)')}
          />
          {errors.quantity && <p style={styles.errorMessage}>{errors.quantity}</p>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>{t('Price per Unit')}</label>
          <input
            type="number"
            name="price"
            value={offerDetails.price}
            onChange={handleInputChange}
            style={styles.input}
            placeholder={t('Price')}
          />
          {errors.price && <p style={styles.errorMessage}>{errors.price}</p>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>{t('Location')}</label>
          <input
            type="text"
            name="location"
            value={offerDetails.location}
            onChange={handleInputChange}
            style={styles.input}
            placeholder={t('Enter pickup location')}
          />
          {errors.location && <p style={styles.errorMessage}>{errors.location}</p>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>{t('Description')}</label>
          <textarea
            name="description"
            value={offerDetails.description}
            onChange={handleInputChange}
            style={styles.input}
            placeholder={t('Provide detailed information, e.g., material condition, specific requirements')}
          />
          {errors.description && <p style={styles.errorMessage}>{errors.description}</p>}
        </div>

        <div style={styles.formGroup}>
            <label style={styles.label}>{t('Upload Photos')}</label>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e.target.files)} // Pass the FileList to handlePhotoUpload
                style={styles.input}
            />
        </div>

        <button type="button" onClick={uploadImagesToS3} style={styles.uploadButton}>
          {t('Upload Images')}
        </button>
        {error && <p style={styles.errorMessage}>{error}</p>}

        <div style={styles.formGroup}>
          <label style={styles.label}>{t('Contact Information')}</label>
          <input
            type="text"
            name="contactInfo"
            value={offerDetails.contactInfo}
            onChange={handleInputChange}
            style={styles.input}
            placeholder={t('Enter your contact information')}
          />
          {errors.contactInfo && <p style={styles.errorMessage}>{errors.contactInfo}</p>}
        </div>

        <button type="submit" style={styles.input}>
          {t('Submit Offer')}
        </button>
      </form>

      {/* Displaying Posted Offers */}
      <div style={styles.previewContainer}>
        <h3 style={styles.previewTitle}>{t('Deals You Posted')}</h3>
        {postedOffers.map((offer) => (
          <div key={offer.offerId} style={styles.postedOffer}>
          <h4>{offer.materialType}</h4>
          <p>{`Quantity: ${offer.quantityAvailable}`}</p>
          <p>{`Price per Unit: ${offer.pricePerUnit}`}</p>
          <p>{`Location: ${offer.location?.address || 'No address provided'}`}</p>
          <p>{offer.description}</p>
          
          {/* Display images */}
          <div style={styles.imageContainer}>
            {offer.images && offer.images.length > 0 ? (
              offer.images.map((image, index) => (
                <img key={index} src={image} alt={`Offer image ${index + 1}`} style={styles.image} />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </div>
        
        ))}
      </div>
    </div>
  );
};

export default SellYourRecyclables;

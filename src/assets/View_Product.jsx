import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPackage, FiHash, FiTag, FiClipboard, FiDollarSign, FiBarChart2, FiUploadCloud, FiPaperclip, FiMaximize, FiDroplet, FiArchive, FiGift, FiBox, FiCpu, FiPercent, FiCalendar, FiStar, FiTrash2, FiArrowUp, FiArrowDown, FiHelpCircle, FiCheckCircle, FiSend, FiEdit } from 'react-icons/fi';
import './View_Product.css'; // Using a new CSS file for this component

// Mock data for a product that would normally be fetched from an API
const mockProduct = {
  supplierNumber: 1,
  name: 'Iron Man',
  productId: 'P-16685280',
  category: 'Action Figure',
  orderQty: 2,
  inStock: 2,
  buyingCost: '500',
  totalCost: '550',
  sellingPrice: '900',
  status: 'Available',
  details: 'The original Iron Man action figure. A must-have for collectors.',
  specifications: {
    materials: 'Plastic, Metal',
    dimensions: '18x9x5 cm',
    color: 'Red, Gold',
    weight: '250g',
    ageRange: '8+ years',
    brand: 'RaccoonToy',
  },
  discountPercent: '10',
  discountStartDate: '2025-12-01',
  discountEndDate: '2025-12-25',
  imagePreviews: ['https://i.ibb.co/6n211ez/d55b8855-3373-4564-8849-0d351980f72c.png', null, null, null, null],
  gifPreview: 'https://media.giphy.com/media/26gR1v0rIDY5pL32w/giphy.gif',
  showcasePreviewUrl: 'https://i.ibb.co/6n211ez/d55b8855-3373-4564-8849-0d351980f72c.png',
  showcaseImageUrl: 'https://i.ibb.co/6n211ez/d55b8855-3373-4564-8849-0d351980f72c.png',
  showcaseGifUrl: 'https://media.giphy.com/media/26gR1v0rIDY5pL32w/giphy.gif',
  bannerImageUrl: 'https://i.ibb.co/yNbW2Yc/5b634863-75dc-45cf-a436-580bff579133.png',
  reviews: [
    { 
      id: 1, user: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice', rating: 5, 
      text: 'Absolutely amazing! The quality is top-notch.', date: new Date('2025-10-15T14:30:00Z'),
      images: ['https://i.ibb.co/b3sVz6k/05f69045-538d-4a8e-a249-160a7e73d66c.png', 'https://i.ibb.co/yNbW2Yc/5b634863-75dc-45cf-a436-580bff579133.png']
    },
    { id: 2, user: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob', rating: 4, text: 'Great product, my son loves it.', date: new Date('2025-10-12T09:05:00Z'), images: [] },
  ],
  qna: [
      { id: 1, user: 'David', avatar: 'https://i.pravatar.cc/150?u=david', question: 'Is the arc reactor removable?', answer: 'No, the arc reactor is integrated into the chest piece and is not removable.', date: new Date('2025-10-10T11:00:00Z') },
      { id: 2, user: 'Eve', avatar: 'https://i.pravatar.cc/150?u=eve', question: 'Does it come with any other accessories?', answer: null, date: new Date('2025-10-09T15:20:00Z') }
  ]
};

const categoryOptions = ['Action Figure', 'Small Action Figure', 'Bricks', 'Vehicle Figure', 'Cute Dolls', 'Small Cute Dolls', 'Decorations'];
const statusOptions = ['Available', 'Stock Out', 'Re-Stock'];
const MAX_IMAGES = 5;

// Star Rating Component
const StarRating = ({ rating }) => (
  <div className="vp-star-rating">
    {[...Array(5)].map((_, index) => (
      <FiStar key={index} className={index < rating ? 'filled' : ''} />
    ))}
  </div>
);

// Function to format the date and time
const formatReviewDate = (date) => {
    return date.toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
    });
};

export default function ViewProductPage() {
  const navigate = useNavigate();
  const { productId: urlProductId } = useParams();
  
  const fileInputRef = useRef(null);
  const gifInputRef = useRef(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const showcasePreviewInputRef = useRef(null);
  const showcaseMainImageInputRef = useRef(null);
  const showcaseGifInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [supplierNumber, setSupplierNumber] = useState('');
  const [name, setName] = useState('');
  const [productId, setProductId] = useState('');
  const [category, setCategory] = useState(categoryOptions[0]);
  const [orderQty, setOrderQty] = useState(1);
  const [inStock, setInStock] = useState(1);
  const [buyingCost, setBuyingCost] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [status, setStatus] = useState(statusOptions[0]);
  const [details, setDetails] = useState('');
  
  const [images, setImages] = useState(Array(MAX_IMAGES).fill(null));
  const [imagePreviews, setImagePreviews] = useState(Array(MAX_IMAGES).fill(null));
  const [gif, setGif] = useState(null);
  const [gifPreview, setGifPreview] = useState(null);

  const [showcasePreview, setShowcasePreview] = useState(null);
  const [showcasePreviewUrl, setShowcasePreviewUrl] = useState(null);
  const [showcaseImage, setShowcaseImage] = useState(null);
  const [showcaseImageUrl, setShowcaseImageUrl] = useState(null);
  const [showcaseGif, setShowcaseGif] = useState(null);
  const [showcaseGifUrl, setShowcaseGifUrl] = useState(null);

  const [discountPercent, setDiscountPercent] = useState('');
  const [discountStartDate, setDiscountStartDate] = useState('');
  const [discountEndDate, setDiscountEndDate] = useState('');
  
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  
  const [reviews, setReviews] = useState([]);
  const [qna, setQna] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');

  const [specifications, setSpecifications] = useState({
    materials: '', dimensions: '', color: '', weight: '', ageRange: '', brand: 'RaccoonToy',
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log("Fetching product with ID:", urlProductId);
    const productData = mockProduct;
    
    setSupplierNumber(productData.supplierNumber);
    setName(productData.name);
    setProductId(productData.productId);
    setCategory(productData.category);
    setOrderQty(productData.orderQty);
    setInStock(productData.inStock);
    setBuyingCost(productData.buyingCost);
    setTotalCost(productData.totalCost);
    setSellingPrice(productData.sellingPrice);
    setStatus(productData.status);
    setDetails(productData.details);
    setSpecifications(productData.specifications);
    setImagePreviews(productData.imagePreviews);
    setGifPreview(productData.gifPreview);
    setShowcasePreviewUrl(productData.showcasePreviewUrl);
    setShowcaseImageUrl(productData.showcaseImageUrl);
    setShowcaseGifUrl(productData.showcaseGifUrl);
    setBannerImageUrl(productData.bannerImageUrl);
    setDiscountPercent(productData.discountPercent);
    setDiscountStartDate(productData.discountStartDate);
    setDiscountEndDate(productData.discountEndDate);
    setReviews(productData.reviews);
    setQna(productData.qna);

  }, [urlProductId]);


  const profit = useMemo(() => Number(sellingPrice) - Number(totalCost), [sellingPrice, totalCost]);
  const marginPct = useMemo(() => (totalCost > 0 ? (profit / Number(totalCost)) * 100 : 0), [profit, totalCost]);

  function handleImageUploadClick(index) {
    setActiveImageIndex(index);
    fileInputRef.current?.click();
  }

  function onImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const newImages = [...images];
    newImages[activeImageIndex] = file;
    setImages(newImages);
    const newImagePreviews = [...imagePreviews];
    newImagePreviews[activeImageIndex] = URL.createObjectURL(file);
    setImagePreviews(newImagePreviews);
    e.target.value = '';
  }

  function handleGifUploadClick() {
    gifInputRef.current?.click();
  }

  function onGifChange(e) {
    const file = e.target.files?.[0];
    if (!file || !file.type.includes('gif')) return;
    setGif(file);
    setGifPreview(URL.createObjectURL(file));
    e.target.value = '';
  }

  const createUploadHandler = (setter, urlSetter) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setter(file);
    urlSetter(URL.createObjectURL(file));
    e.target.value = '';
  };
  
  const onShowcasePreviewChange = createUploadHandler(setShowcasePreview, setShowcasePreviewUrl);
  const onShowcaseImageChange = createUploadHandler(setShowcaseImage, setShowcaseImageUrl);
  const onShowcaseGifChange = createUploadHandler(setShowcaseGif, setShowcaseGifUrl);
  const onBannerImageChange = createUploadHandler(setBannerImage, setBannerImageUrl);
  
  function handleSpecChange(e) {
    const { name, value } = e.target;
    setSpecifications(prev => ({ ...prev, [name]: value }));
  }

  function handleDeleteReview(reviewId) {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  }

  function handleMoveReview(index, direction) {
    const newReviews = [...reviews];
    const item = newReviews[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newReviews.length) return;
    newReviews[index] = newReviews[swapIndex];
    newReviews[swapIndex] = item;
    setReviews(newReviews);
  }

  function handleDeleteQuestion(qnaId) {
      setQna(prev => prev.filter(q => q.id !== qnaId));
  }

  function handleReplySubmit(qnaId) {
      if (!newAnswer.trim()) return;
      setQna(prev => prev.map(q => q.id === qnaId ? {...q, answer: newAnswer} : q));
      setReplyingTo(null);
      setNewAnswer('');
  }

  function validate() {
    const next = {};
    if (!name.trim()) next.name = 'Product name is required';
    if (!productId.trim()) next.productId = 'Product ID is required';
    if (!imagePreviews[0]) next.image = 'Primary image is required';
    return next;
  }

  function onUpdate(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    console.log("Updating product:", { name, productId, images, gif, specifications, discountPercent, discountStartDate, discountEndDate, bannerImage, reviews, qna });
    alert('Product updated successfully!');
    navigate('/products');
  }

  return (
    <section className="vp-page">
      <header className="vp-header">
        <h1>Edit Product</h1>
        <div className="vp-header-actions">
          <button type="button" className="vp-btn vp-btn-muted" onClick={() => navigate('/products')}>Back to List</button>
          <button type="submit" form="view-product-form" className="vp-btn vp-btn-primary">Update Product</button>
        </div>
      </header>

      <form id="view-product-form" onSubmit={onUpdate} noValidate>
        <div className="vp-form-grid">
          {/* Left Panel */}
          <div className="vp-left-panel">
            <div className="vp-card">
              <h2 className="vp-card-title">Product Information</h2>
              <div className="vp-field">
                <label htmlFor="name"><FiPackage /> Product Name</label>
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Iron Man Action Figure" />
                {errors.name && <div className="vp-err">{errors.name}</div>}
              </div>
              <div className="vp-field-row">
                <div className="vp-field">
                  <label htmlFor="productId"><FiHash /> Product ID</label>
                  <div className="vp-input-with-btn">
                    <input id="productId" type="text" value={productId} onChange={(e) => setProductId(e.target.value)} readOnly />
                  </div>
                  {errors.productId && <div className="vp-err">{errors.productId}</div>}
                </div>
                <div className="vp-field">
                  <label htmlFor="category"><FiTag /> Category</label>
                  <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="vp-card">
              <h2 className="vp-card-title">Inventory & Pricing</h2>
               <div className="vp-field-row">
                <div className="vp-field">
                  <label htmlFor="orderQty">Order Qty</label>
                  <input id="orderQty" type="number" value={orderQty} onChange={(e) => setOrderQty(Number(e.target.value))} />
                </div>
                <div className="vp-field">
                  <label htmlFor="inStock">In Stock</label>
                  <input id="inStock" type="number" value={inStock} onChange={(e) => setInStock(Number(e.target.value))} />
                </div>
                 <div className="vp-field">
                  <label htmlFor="supplierNumber">Supplier #</label>
                  <input id="supplierNumber" type="number" value={supplierNumber} onChange={(e) => setSupplierNumber(Number(e.target.value))} placeholder="e.g., 1" />
                </div>
              </div>
              <div className="vp-field-row">
                <div className="vp-field">
                  <label htmlFor="buyingCost"><FiDollarSign /> Buying Cost</label>
                  <input id="buyingCost" type="number" value={buyingCost} onChange={(e) => setBuyingCost(e.target.value)} placeholder="0.00" />
                </div>
                <div className="vp-field">
                  <label htmlFor="totalCost"><FiDollarSign /> Total Cost</label>
                  <input id="totalCost" type="number" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} placeholder="0.00" />
                </div>
                <div className="vp-field">
                  <label htmlFor="sellingPrice"><FiDollarSign /> Selling Price</label>
                  <input id="sellingPrice" type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="0.00" />
                </div>
              </div>
              <div className="vp-metrics">
                <div className="vp-chip"><FiBarChart2 /> Profit: <strong>${profit.toFixed(2)}</strong></div>
                <div className="vp-chip">Margin: <strong>{marginPct.toFixed(1)}%</strong></div>
              </div>
            </div>
            
            <div className="vp-card">
              <h2 className="vp-card-title">Specifications</h2>
              <div className="vp-spec-grid">
                <div className="vp-field">
                  <label htmlFor="materials"><FiBox/> Materials</label>
                  <input id="materials" name="materials" type="text" value={specifications.materials} onChange={handleSpecChange} placeholder="e.g., Plastic" />
                </div>
                <div className="vp-field">
                  <label htmlFor="dimensions"><FiMaximize/> Dimensions</label>
                  <input id="dimensions" name="dimensions" type="text" value={specifications.dimensions} onChange={handleSpecChange} placeholder="e.g., 12x7x12 cm" />
                </div>
                <div className="vp-field">
                  <label htmlFor="color"><FiDroplet/> Color</label>
                  <input id="color" name="color" type="text" value={specifications.color} onChange={handleSpecChange} placeholder="e.g., Green" />
                </div>
                <div className="vp-field">
                  <label htmlFor="weight"><FiArchive/> Weight</label>
                  <input id="weight" name="weight" type="text" value={specifications.weight} onChange={handleSpecChange} placeholder="e.g., 150g" />
                </div>
                <div className="vp-field">
                  <label htmlFor="ageRange"><FiGift/> Age Range</label>
                  <input id="ageRange" name="ageRange" type="text" value={specifications.ageRange} onChange={handleSpecChange} placeholder="e.g., 6+ years" />
                </div>
                <div className="vp-field">
                  <label htmlFor="brand"><FiCpu/> Brand</label>
                  <input id="brand" name="brand" type="text" value={specifications.brand} onChange={handleSpecChange} placeholder="e.g., RaccoonToy" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="vp-right-panel">
            <div className="vp-card">
              <h2 className="vp-card-title">Product Media</h2>
              <p className="vp-media-sub">Add up to 5 images. The first is the primary image.</p>
              
              <div className="vp-uploader vp-uploader-primary" onClick={() => handleImageUploadClick(0)}>
                {imagePreviews[0] ? (
                  <img src={imagePreviews[0]} alt="Primary product view" />
                ) : (
                  <div className="vp-upload-placeholder">
                    <FiUploadCloud size={32} />
                    <span>Upload Primary Image</span>
                  </div>
                )}
              </div>
              {errors.image && <div className="vp-err">{errors.image}</div>}
              
              <div className="vp-secondary-grid">
                {imagePreviews.slice(1).map((preview, index) => (
                  <div key={index} className="vp-uploader vp-uploader-secondary" onClick={() => handleImageUploadClick(index + 1)}>
                    {preview ? (
                      <img src={preview} alt={`Secondary product view ${index + 1}`} />
                    ) : (
                      <div className="vp-upload-placeholder-small">
                        <FiUploadCloud size={20} />
                        <span>Add image</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={onImageChange} hidden />
            </div>
            
            <div className="vp-card">
              <h2 className="vp-card-title">Product GIF</h2>
              <p className="vp-media-sub">Add a showcase GIF for the product.</p>
              <div className="vp-uploader vp-uploader-gif" onClick={handleGifUploadClick}>
                {gifPreview ? (
                  <img src={gifPreview} alt="Product GIF preview" />
                ) : (
                  <div className="vp-upload-placeholder">
                    <FiUploadCloud size={32} />
                    <span>Upload GIF</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/gif" ref={gifInputRef} onChange={onGifChange} hidden />
            </div>

            <div className="vp-card">
              <h2 className="vp-card-title">Details & Status</h2>
              <div className="vp-field">
                <label htmlFor="status"><FiPaperclip /> Status</label>
                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="vp-field">
                <label htmlFor="details"><FiClipboard /> Product Details</label>
                <textarea id="details" rows={6} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Add notes, variations, etc." />
              </div>
            </div>
          </div>
        </div>

        <div className="vp-separator"></div>

        <div className="vp-bottom-grid">
          {/* Left Column: Showcase */}
          <div className="vp-card vp-showcase-card">
            <h2 className="vp-card-title">Showcase</h2>
            <p className="vp-media-sub">Upload specific images for the product's feature showcase section on the main site.</p>
            
            <div className="vp-showcase-upload-grid">
              {/* Showcase Preview Image Uploader */}
              <div className="vp-field">
                <label>Preview Image</label>
                <div className="vp-uploader vp-uploader-secondary" onClick={() => showcasePreviewInputRef.current.click()}>
                  {showcasePreviewUrl ? (
                    <img src={showcasePreviewUrl} alt="Showcase Preview" />
                  ) : (
                    <div className="vp-upload-placeholder-small">
                      <FiUploadCloud size={20} />
                      <span>Upload</span>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" ref={showcasePreviewInputRef} onChange={onShowcasePreviewChange} hidden />
              </div>

              {/* Showcase Main Image Uploader */}
              <div className="vp-field">
                <label>Main Product Image</label>
                <div className="vp-uploader vp-uploader-secondary" onClick={() => showcaseMainImageInputRef.current.click()}>
                  {showcaseImageUrl ? (
                    <img src={showcaseImageUrl} alt="Showcase Main" />
                  ) : (
                    <div className="vp-upload-placeholder-small">
                      <FiUploadCloud size={20} />
                      <span>Upload</span>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" ref={showcaseMainImageInputRef} onChange={onShowcaseImageChange} hidden />
              </div>
              
              {/* Showcase GIF Uploader */}
              <div className="vp-field">
                <label>Product GIF</label>
                <div className="vp-uploader vp-uploader-secondary" onClick={() => showcaseGifInputRef.current.click()}>
                  {showcaseGifUrl ? (
                    <img src={showcaseGifUrl} alt="Showcase GIF" />
                  ) : (
                    <div className="vp-upload-placeholder-small">
                      <FiUploadCloud size={20} />
                      <span>Upload</span>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/gif" ref={showcaseGifInputRef} onChange={onShowcaseGifChange} hidden />
              </div>
            </div>
          </div>
          {/* Right Column: Discount */}
          <div className="vp-card">
            <h2 className="vp-card-title">Discount</h2>
            <div className="vp-field">
              <label htmlFor="discountPercent"><FiPercent/> Discount Percentage</label>
              <input id="discountPercent" type="number" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} placeholder="e.g., 15" />
            </div>
            <div className="vp-field-row">
              <div className="vp-field">
                <label htmlFor="discountStartDate"><FiCalendar/> Start Date</label>
                <input id="discountStartDate" type="date" value={discountStartDate} onChange={(e) => setDiscountStartDate(e.target.value)} />
              </div>
              <div className="vp-field">
                <label htmlFor="discountEndDate"><FiCalendar/> End Date</label>
                <input id="discountEndDate" type="date" value={discountEndDate} onChange={(e) => setDiscountEndDate(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="vp-separator"></div>

        <div className="vp-card">
            <h2 className="vp-card-title">Banner Section</h2>
            <p className="vp-media-sub">Upload a wide banner image for promotional pages.</p>
            <div className="vp-uploader vp-uploader-banner" onClick={() => bannerInputRef.current.click()}>
                {bannerImageUrl ? (
                <img src={bannerImageUrl} alt="Banner Preview" />
                ) : (
                <div className="vp-upload-placeholder">
                    <FiUploadCloud size={32} />
                    <span>Upload Banner Image</span>
                </div>
                )}
            </div>
            <input type="file" accept="image/*" ref={bannerInputRef} onChange={onBannerImageChange} hidden />
        </div>
        
        <div className="vp-separator"></div>

        <div className="vp-card">
            <h2 className="vp-card-title">Manage Reviews</h2>
            <div className="vp-reviews-list">
                {reviews.map((review, index) => (
                    <div key={review.id} className="vp-review-item">
                        <div className="vp-review-header">
                            <img src={review.avatar} alt={review.user} className="vp-review-avatar" />
                            <div className="vp-review-user-info">
                                <span className="vp-review-user-name">{review.user}</span>
                                <StarRating rating={review.rating} />
                                <span className="vp-review-date">{formatReviewDate(review.date)}</span>
                            </div>
                        </div>
                        <p className="vp-review-text">{review.text}</p>
                        {review.images && review.images.length > 0 && (
                            <div className="vp-review-images">
                                {review.images.map((img, imgIndex) => (
                                    <img key={imgIndex} src={img} alt={`Review image ${imgIndex + 1}`} className="vp-review-image" />
                                ))}
                            </div>
                        )}
                        <div className="vp-review-actions">
                            <button type="button" className="vp-review-action-btn" onClick={() => handleMoveReview(index, 'up')} disabled={index === 0}>
                                <FiArrowUp />
                            </button>
                            <button type="button" className="vp-review-action-btn" onClick={() => handleMoveReview(index, 'down')} disabled={index === reviews.length - 1}>
                                <FiArrowDown />
                            </button>
                            <button type="button" className="vp-review-action-btn delete" onClick={() => handleDeleteReview(review.id)}>
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="vp-separator"></div>

        <div className="vp-card">
            <h2 className="vp-card-title">Questions & Answers</h2>
            <div className="vp-qna-list">
                {qna.map(item => (
                    <div key={item.id} className="vp-qna-item">
                        <div className="vp-qna-header">
                            <img src={item.avatar} alt={item.user} className="vp-qna-avatar" />
                            <div className="vp-qna-user-info">
                                <span className="vp-qna-user-name">{item.user}</span>
                                <span className="vp-qna-date">{formatReviewDate(item.date)}</span>
                            </div>
                            <button type="button" className="vp-qna-delete-btn" onClick={() => handleDeleteQuestion(item.id)}><FiTrash2/></button>
                        </div>
                        <p className="vp-qna-question"><FiHelpCircle/> {item.question}</p>
                        
                        {replyingTo === item.id ? (
                            <div className="vp-qna-reply-section">
                                <div className="vp-qna-reply-form">
                                    <textarea value={newAnswer} onChange={e => setNewAnswer(e.target.value)} placeholder="Type your answer..."/>
                                    <button type="button" onClick={() => handleReplySubmit(item.id)}><FiSend/> Submit</button>
                                </div>
                            </div>
                        ) : item.answer ? (
                            <div className="vp-qna-answered-block">
                                <p className="vp-qna-answer"><FiCheckCircle/> {item.answer}</p>
                                <button type="button" className="vp-qna-edit-btn" onClick={() => { setReplyingTo(item.id); setNewAnswer(item.answer); }}>
                                    <FiEdit/> Edit
                                </button>
                            </div>
                        ) : (
                            <div className="vp-qna-reply-section">
                                <button type="button" className="vp-qna-reply-btn" onClick={() => { setReplyingTo(item.id); setNewAnswer(''); }}>
                                    Reply
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </form>
    </section>
  );
}
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave, FaHeart, FaRegHeart } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Ratings & Reviews States
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [userRating, setUserRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    useEffect(() => {
        const fetchEventAndReviews = async () => {
            try {
                // Fetch Event Details
                const eventRes = await api.get(`/events/${id}`);
                setEvent(eventRes.data);

                // Fetch Reviews
                const reviewRes = await api.get(`/reviews/${id}`);
                setReviews(reviewRes.data.reviews);
                setAvgRating(reviewRes.data.avgRating);

                // If user is authenticated, check bookmark status
                if (user) {
                    try {
                        const bookmarkRes = await api.get('/bookmarks');
                        const isSaved = bookmarkRes.data.some(b => b.event?._id === id || b.event === id);
                        setIsBookmarked(isSaved);
                    } catch (bookmarkErr) {
                        console.error('Error fetching bookmark status:', bookmarkErr);
                    }
                }
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };

        fetchEventAndReviews();
    }, [id, user]);

    const handleToggleBookmark = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const { data } = await api.post('/bookmarks', { eventId: event._id });
            setIsBookmarked(data.bookmarked);
        } catch (err) {
            console.error('Failed to update wishlist', err);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            await api.post('/bookings', { eventId: event._id });
            setSuccessMsg('Booking requested successfully!');
            // Update local seats count dynamically after booking
            setEvent({ ...event, availableSeats: event.availableSeats - 1 });
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        setReviewSubmitting(true);
        try {
            await api.post('/reviews', { eventId: id, rating: userRating, comment });
            setComment('');
            // Refresh reviews list
            const { data } = await api.get(`/reviews/${id}`);
            setReviews(data.reviews);
            setAvgRating(data.avgRating);
        } catch (err) {
            console.error('Failed to submit review:', err);
        } finally {
            setReviewSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading...</div>;
    if (error && !event) return <div className="text-center py-20 text-xl text-red-500">{error || 'Event not found'}</div>;

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8 mb-16">
            <div className="relative bg-gray-900 flex justify-center items-center overflow-hidden">
                {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-auto max-h-[500px] object-contain" />
                ) : (
                    <div className="w-full h-64 bg-gray-900 flex items-center justify-center text-white/50 text-6xl font-black uppercase tracking-widest">
                        {event.category}
                    </div>
                )}

                {/* Bookmark / Wishlist Toggle Button */}
                <button
                    onClick={handleToggleBookmark}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white p-3.5 rounded-full shadow-lg transition transform hover:scale-110 active:scale-95 flex items-center justify-center z-10"
                    title={isBookmarked ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                    {isBookmarked ? (
                        <FaHeart className="text-red-500 text-2xl" />
                    ) : (
                        <FaRegHeart className="text-gray-700 text-2xl" />
                    )}
                </button>
            </div>

            <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                    <div>
                        <div className="inline-block bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                            {event.category}
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{event.title}</h1>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">{event.description}</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 min-w-[300px] w-full md:w-auto shrink-0 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Booking Details</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                    <FaMoneyBillWave />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase">Ticket Price</p>
                                    <p className="font-bold text-gray-800 text-lg">{event.ticketPrice === 0 ? <span className="text-green-500">Free</span> : `₹${event.ticketPrice}`}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                    <FaChair />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase">Availability</p>
                                    <p className="font-bold text-gray-800">
                                        <span className={event.availableSeats < 10 ? 'text-orange-500' : ''}>{event.availableSeats}</span> / {event.totalSeats}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                    <FaCalendarAlt />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase">Date</p>
                                    <p className="font-bold text-gray-800">{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase">Location</p>
                                    <p className="font-bold text-gray-800">{event.location}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={isSoldOut || bookingLoading || successMsg}
                            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition shadow-lg ${isSoldOut || successMsg
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-900 hover:bg-black text-white hover:shadow-xl hover:-translate-y-1'
                                }`}
                        >
                            {bookingLoading ? 'Processing...' : (successMsg ? 'Booked Successfully' : (isSoldOut ? 'Sold Out' : 'Confirm Registration'))}
                        </button>
                        {error && <p className="text-red-500 mt-4 text-center font-medium bg-red-50 p-2 rounded">{error}</p>}
                        {successMsg && <p className="text-green-600 mt-4 text-center font-medium bg-green-50 p-2 rounded">{successMsg}</p>}
                    </div>
                </div>

                {/* Ratings & Reviews Section */}
                <div className="mt-12 border-t pt-8">
                    <h2 className="text-2xl font-bold mb-4">Customer Reviews ⭐ {avgRating} / 5 ({reviews.length})</h2>

                    {/* Review Submission Form */}
                    {user && (
                        <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <h4 className="font-bold mb-2">Leave a Review</h4>
                            <div className="flex gap-2 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setUserRating(star)}
                                        className={`text-2xl ${star <= userRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience..."
                                required
                                className="w-full p-3 border rounded-lg mb-3 bg-white"
                                rows="3"
                            />
                            <button
                                type="submit"
                                disabled={reviewSubmitting}
                                className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition shadow-md"
                            >
                                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {reviews.length === 0 ? (
                            <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
                        ) : (
                            reviews.map((rev) => (
                                <div key={rev._id} className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold">{rev.user?.name || 'Anonymous User'}</span>
                                        <span className="text-yellow-500 font-bold">{"★".repeat(rev.rating)}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{rev.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
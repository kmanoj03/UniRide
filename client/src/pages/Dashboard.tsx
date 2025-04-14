/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import {
  Car,
  Calendar,
  Calculator,
  Clock,
  User,
  LogOut,
  Search,
  Star,
  Plus,
  Phone,
  X,
  Users,
} from "lucide-react";

import AlertModal from "../components/AltertModal";

import axios from "axios";

// Mock user data
let currentUser = {
  fullName: "",
  email: "",
  phone: "",
  numberOfRides: 0,
  ratings: 0.0,
};

function ReviewModal({
  ride,
  onClose,
  currentUser,
}: {
  ride: any;
  onClose: () => void;
  currentUser: any;
}) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [revieweeEmail, setRevieweeEmail] = useState("");

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "info"
  );

  const handleSubmit = async () => {
    if (!revieweeEmail) {
      setAlertMessage("Please select a member to review.");
      setAlertType("error");
      setAlertOpen(true);
      return;
    }

    try {
      const res = await axios.post("/api/ride/review", {
        reviewerEmail: currentUser.email,
        revieweeEmail,
        rating,
        comment: review,
        rideId: ride._id,
      });

      if (res.data.status === 200) {
        setAlertMessage(res.data.message);
        setAlertType("success");
        setAlertOpen(true);
        setTimeout(() => {
          onClose(); // ⬅️ Close the review modal AFTER the alert is shown
        }, 3000);
      } else {
        setAlertMessage(res.data.message);
        setAlertType("error");
        setAlertOpen(true);
        setTimeout(() => {
          onClose(); // ⬅️ Close the review modal AFTER the alert is shown
        }, 3000);
      }
    } catch (err: any) {
      setAlertMessage(
        err.response?.data?.message || "Failed to submit review."
      );
      setAlertType("error");
      setAlertOpen(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Review Your Ride
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              Ride: {ride.source} → {ride.destination}
            </p>
            <p className="text-gray-600 text-sm">
              Date: {ride.date.slice(0, 10)}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a member to review
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={revieweeEmail}
              onChange={(e) => setRevieweeEmail(e.target.value)}
            >
              <option value="">Select a member</option>
              {ride.members
                .filter((member: any) => member.email !== currentUser.email)
                .map((member: any) => (
                  <option key={member.email} value={member.email}>
                    {member.fullName}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
              placeholder="Share your experience..."
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Submit Review
          </button>
        </div>
        <AlertModal
          message={alertMessage}
          type={alertType}
          isOpen={alertOpen}
          onClose={() => setAlertOpen(false)}
        />
      </div>
    </>
  );
}

function RideCard({
  ride,
  onClose,
  onBook,
}: {
  ride: any;
  onClose: () => void;
  onBook?: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Ride Details</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Route and Time */}
          <div className="mb-8">
            <div className="text-xl font-semibold text-gray-900 mb-2">
              {ride.source} → {ride.destination}
            </div>
            <div className="text-gray-600">Departure: {ride.timeOfStart}</div>
            {/* <div className="text-lg font-semibold text-indigo-600 mt-2">
              ${ride.price}
            </div> */}
          </div>

          {/* Host Information */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">The Host</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-medium text-gray-900">
                    {ride.fullName}
                  </div>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">
                      {ride.hostAverageRating}
                    </span>
                    <span className="text-gray-600 ml-2">
                      ({ride.hostNumberOfRides} rides)
                    </span>
                    {/* {ride.phone} */}
                  </div>
                </div>
              </div>
              {ride.hostRecentReviews?.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Recent Reviews
                  </div>
                  {ride.hostRecentReviews.map((review, index) => (
                    <div key={index} className="border-t border-gray-200 py-2">
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 italic">
                        "{review.comment}"
                      </p>
                      <p className="text-xs text-gray-500">
                        – {review.reviewerName}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Seats and Passengers */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">Ride Details</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-gray-700">Available Seats</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {ride.seatsAvailable}
                  </div>
                </div>
                {typeof onBook === "function" &&
                  onBook.toString() !== "() => {}" && (
                    <button
                      onClick={onBook}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Book Now
                    </button>
                  )}
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Other Passengers
                </div>

                {ride.members.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {ride.members.map((passenger: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                          {passenger.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-600">
                          {passenger.fullName}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No other passengers yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateRideForm({ initialData, onRideCreated }) {
  const [rideDetails, setRideDetails] = useState({
    fullName: currentUser.fullName,
    email: currentUser.email,
    phone: currentUser.phone,
    source: initialData?.source || "",
    destination: initialData?.destination || "",
    date: initialData?.date || "",
    timeOfStart: "",
    seatsAvailable: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to create ride
    const data = rideDetails;

    try {
      const res = await axios.post("/api/ride/create", data);
      if (res.data.status === 200) {
        alert(res.data.message);
        setRideDetails({
          fullName: "",
          email: "",
          phone: "",
          source: "",
          destination: "",
          date: "",
          timeOfStart: "",
          seatsAvailable: 1,
        });
        onRideCreated();
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Create a Ride</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Leaving From
          </label>
          <input
            type="text"
            value={rideDetails.source}
            onChange={(e) =>
              setRideDetails({ ...rideDetails, source: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter Source Location"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Going To
          </label>
          <input
            type="text"
            value={rideDetails.destination}
            onChange={(e) =>
              setRideDetails({ ...rideDetails, destination: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter Destination Location"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={rideDetails.date}
            onChange={(e) =>
              setRideDetails({ ...rideDetails, date: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            value={rideDetails.timeOfStart}
            onChange={(e) =>
              setRideDetails({ ...rideDetails, timeOfStart: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Seats
          </label>
          <select
            value={rideDetails.seatsAvailable}
            onChange={(e) =>
              setRideDetails({
                ...rideDetails,
                seatsAvailable: Number(e.target.value),
              })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create Ride
        </button>
      </form>
    </div>
  );
}

function TakeARide() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    source: "",
    destination: "",
    date: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [showCreateRide, setShowCreateRide] = useState(false);

  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  const showAlert = (message: string, type: "success" | "error" | "info") => {
    setAlert({
      isOpen: true,
      message,
      type,
    });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post("/api/ride/find", searchParams);

      if (!response.data.success) {
        setSearchResults([]);
        setHasSearched(true);
      }

      if (response.data.success) {
        const formattedRides = response.data.rides.map((ride) => ({
          ...ride,
          date: new Date(Date.parse(ride.date)).toLocaleDateString(), // Force parsing
        }));
        setSearchResults(formattedRides); // Assuming `rides` is returned from API
        setHasSearched(true);
        setShowCreateRide(false);
      }
    } catch (error) {
      console.error("Error while searching for rides:", error);
    }
  };

  const handleCreateRide = () => {
    setShowCreateRide(true);
  };

  const handleRideCreated = () => {
    setShowCreateRide(false);
    navigate("/dashboard/upcoming");
  };

  const handleBookRide = async () => {
    if (!selectedRide) return;

    try {
      const res = await axios.post("/api/ride/book", {
        rideId: selectedRide._id,
        fullName: currentUser.fullName,
        email: currentUser.email,
      });

      if (res.data.status === 200) {
        showAlert("Ride booked successfully!", "success");
        setSelectedRide(null);
        setTimeout(() => {
          navigate("/dashboard/upcoming"); // Navigate after a delay
        }, 2000);
      } else {
        showAlert(res.data.message, "error");
      }
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Failed to book the ride",
        "error"
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Find a Ride</h2>
        {/* <div className="text-gray-600">Hey, {currentUser.fullName}!</div> */}
      </div>

      {!showCreateRide ? (
        <>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leaving From
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter pickup location"
                value={searchParams.source}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, source: e.target.value })
                }
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Going To
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter destination"
                value={searchParams.destination}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    destination: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchParams.date}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, date: e.target.value })
                }
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {hasSearched && (
            <div className="space-y-4">
              {searchResults.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Available Rides
                  </h3>
                  {searchResults.map((result: any) => (
                    <div
                      key={result.rideId}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer"
                      onClick={() => setSelectedRide(result)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-medium text-gray-900">
                            {result.source} → {result.destination}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">
                              {result.fullName}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{result.timeOfStart}</span>
                            <span className="mx-2">•</span>
                            <span>{result.seatsAvailable} seats left</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {/* <div className="text-lg font-semibold text-indigo-600">
                            ${result.price}
                          </div> */}
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">
                              {result.hostAverageRating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    No rides found for your search criteria
                  </p>
                  <button
                    onClick={handleCreateRide}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Create this ride
                  </button>
                </div>
              )}
            </div>
          )}

          {selectedRide && (
            <RideCard
              ride={selectedRide}
              onClose={() => setSelectedRide(null)}
              onBook={handleBookRide}
            />
          )}

          {!hasSearched && (
            <div className="text-center mt-8">
              <button
                onClick={handleCreateRide}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create a Ride
              </button>
            </div>
          )}
        </>
      ) : (
        <CreateRideForm
          initialData={searchParams}
          onRideCreated={handleRideCreated}
        />
      )}
      <>
        <AlertModal
          isOpen={alert.isOpen}
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, isOpen: false })}
        />
      </>
    </div>
  );
}

function UpcomingRides({ currentUser }) {
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState<any>(null);

  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  const showAlert = (message: string, type: "success" | "error" | "info") => {
    setAlert({
      isOpen: true,
      message,
      type,
    });
  };

  useEffect(() => {
    const fetchUpcomingRides = async () => {
      try {
        const res = await axios.post(`/api/ride/upcoming`, {
          email: currentUser.email,
        });
        if (res.data.status === 200) {
          setRides(res.data.rides);
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchUpcomingRides();
  }, [currentUser.email]); // Fetch when email changes

  const handleCancelRide = async (rideId: number) => {
    try {
      // Send request to cancel ride (implement this in backend)
      const res = await axios.post("/api/ride/cancel", {
        rideId,
        email: currentUser.email,
      });

      if (res.data.status === 200) {
        showAlert(res.data.message, "info");
      }

      // Update UI
      setRides((prevRides) =>
        prevRides.filter((ride) => ride.rideId !== rideId)
      );
    } catch (error) {
      showAlert("Something went wrong while canceling the ride", "error");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upcoming Rides</h2>
        {/* <div className="text-gray-600">Hey, {currentUser.fullName}!</div> */}
      </div>

      {rides.length > 0 ? (
        <div className="space-y-4">
          {rides.map((ride: any) => (
            <div
              key={ride.rideId}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer"
              onClick={() => setSelectedRide(ride)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium text-gray-900">
                    {ride.source} → {ride.destination}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <div>Date: {ride.date.slice(0, 10)}</div>
                    <div>Time: {ride.timeOfStart}</div>
                    <div className="mt-2">
                      <span className="font-medium">Host: {ride.fullName}</span>
                      <span className="mx-2">•</span>
                      <span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current inline-block mr-1" />
                        {ride.hostAverageRating}
                      </span>
                    </div>
                    <div className="mt-2">
                      <Phone className="w-4 h-4 inline-block mr-2" />
                      {ride.phone}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevents the ride card modal from opening
                    handleCancelRide(ride.rideId);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Ride
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600">No upcoming rides</div>
      )}

      {selectedRide && (
        <RideCard
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          onBook={undefined} // no booking for upcoming rides
        />
      )}
      <>
        <AlertModal
          isOpen={alert.isOpen}
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, isOpen: false })}
        />
      </>
    </div>
  );
}

function PastRides({ currentUser }) {
  const [selectedRide, setSelectedRide] = useState<any>(null);
  type Member = {
    fullName: string;
    email: string;
  };

  type Ride = {
    _id: string;
    rideId: string;
    fullName: string;
    email: string;
    phone: string;
    source: string;
    destination: string;
    date: string;
    timeOfStart: string;
    seatsAvailable: string;
    completed?: boolean; // or completed?
    members: Member[];
    // add other fields if needed
  };

  const [pastRides, setPastRides] = useState<Ride[]>([]);

  useEffect(() => {
    const fetchPastRides = async () => {
      try {
        const res = await axios.post(`/api/ride/past`, {
          email: currentUser.email,
        });
        if (res.data.status === 200) {
          setPastRides(res.data.pastRides);
        }
      } catch (error) {
        console.error("Failed to load past rides:", error);
      }
    };

    fetchPastRides();
  }, [currentUser.email]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Past Rides</h2>
        {/* <div className="text-gray-600">Hey, {currentUser.fullName}!</div> */}
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-600">
            {pastRides.length}
          </div>
          <div className="text-sm text-indigo-600">Completed Rides</div>
        </div>
      </div>

      <div className="space-y-4">
        {pastRides.map((ride: any) => (
          <div key={ride.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-medium text-gray-900">
                  {ride.source} → {ride.destination}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <div>Date: {ride.date.slice(0, 10)}</div>
                  <div>Time: {ride.timeOfStart}</div>
                  <div className="mt-2">
                    <span className="font-medium">Host: {ride.fullName}</span>
                    <span className="mx-2">•</span>
                    <span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current inline-block mr-1" />
                      {ride.hostAverageRating ?? "NA"}
                    </span>
                  </div>
                </div>
              </div>
              {/* {!ride.reviewed && (
                <button
                  onClick={() => setSelectedRide(ride)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Leave Review
                </button>
              )} */}
              <button
                onClick={() => setSelectedRide(ride)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Leave Review
              </button>
              {currentUser.email === ride.email && !ride.completed && (
                <button
                  onClick={async () => {
                    try {
                      const res = await axios.post("/api/ride/complete", {
                        rideId: ride.rideId,
                      });
                      if (res.data.status === 200) {
                        // Optional: refetch the rides or update locally
                        setPastRides((prev) =>
                          prev.map((r) =>
                            r._id === ride._id ? { ...r, completed: true } : r
                          )
                        );
                        alert("Ride marked as completed!");
                      } else {
                        alert(
                          "Something went wrong while completing the ride."
                        );
                      }
                    } catch (error) {
                      console.error("Error completing ride:", error);
                      alert("Failed to complete ride.");
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Complete Ride
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedRide && (
        <ReviewModal
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

// function CostCalculator() {
//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Cost Calculator</h2>
//         {/* <div className="text-gray-600">Hey, {currentUser.fullName}!</div> */}
//       </div>
//       {/* Add calculator component here */}
//     </div>
//   );
// }

function Profile() {
  const [profileData, setProfileData] = useState({
    name: currentUser.fullName,
    phone: currentUser.phone,
  });

  const [accountData, setAccountData] = useState({
    email: currentUser.email,
    currentPassword: "",
    newPassword: "",
  });

  const handleProfileSave = () => {
    console.log("Saving profile:", profileData);
  };

  const handleAccountSave = () => {
    console.log("Saving account:", accountData);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Profile</h2>
        {/* <div className="text-gray-600">Hey, {currentUser.fullName}!</div> */}
      </div>

      {/* About You Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">About You</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData({ ...profileData, phone: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Your phone number"
            />
          </div>
          <button
            onClick={handleProfileSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Account Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Account</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={accountData.email}
              onChange={(e) =>
                setAccountData({ ...accountData, email: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Change Password
            </label>
            <input
              type="password"
              value={accountData.currentPassword}
              onChange={(e) =>
                setAccountData({
                  ...accountData,
                  currentPassword: e.target.value,
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-2"
              placeholder="Current password"
            />
            <input
              type="password"
              value={accountData.newPassword}
              onChange={(e) =>
                setAccountData({ ...accountData, newPassword: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="New password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Rating
            </label>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-lg font-medium">{currentUser.ratings}</span>
              <span className="text-sm text-gray-600">
                ({currentUser.numberOfRides} rides)
              </span>
            </div>
          </div>
          <button
            onClick={handleAccountSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    numberOfRides: 0,
    ratings: 0.0,
  });

  useEffect(() => {
    const email = localStorage.getItem("email");
    const payLoad = {
      email,
    };
    axios
      .post("/api/user/data", payLoad)
      .then((response) => {
        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          console.error("Failed to fetch User data");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
      });
  }, []);

  currentUser = userData;

  const handleLogout = () => {
    navigate("/");
  };

  const NavItem = ({
    to,
    icon: Icon,
    children,
  }: {
    to: string;
    icon: any;
    children: React.ReactNode;
  }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive
            ? "bg-indigo-50 text-indigo-600"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {/* <aside
        className={`w-64 bg-white border-r border-gray-200 p-4 dark:bg-gray-900 ${
          isSidebarOpen ? "" : "hidden"
        }`}
      > */}
      <aside
        className={`w-64 bg-white border-r border-gray-200 p-4 dark:bg-gray-900 ${
          isSidebarOpen ? "" : "hidden"
        }`}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Car className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">UniRide</span>
        </div>

        {/* <nav className="space-y-2"> */}
        <nav className="space-y-1">
          <NavItem to="/dashboard" icon={Car}>
            Take A Ride
          </NavItem>
          <NavItem to="/dashboard/upcoming" icon={Calendar}>
            Upcoming Rides
          </NavItem>
          {/* <NavItem to="/dashboard/calculator" icon={Calculator}>
            Calculator
          </NavItem> */}
          <NavItem to="/dashboard/past-rides" icon={Clock}>
            Past Rides
          </NavItem>
          <NavItem to="/dashboard/profile" icon={User}>
            Profile
          </NavItem>
        </nav>

        {/* <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mt-auto absolute bottom-4 w-[calc(100%-2rem)]"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button> */}
        <div className="fixed bottom-4 w-56">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="text-lg font-medium text-gray-800 dark:text-gray-100">
            Hey, {currentUser.fullName || "User"} 👋
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"} Mode
          </button>
        </div>

        <Routes>
          <Route index element={<TakeARide />} />
          <Route
            path="upcoming"
            element={<UpcomingRides currentUser={currentUser} />}
          />
          {/* <Route path="calculator" element={<CostCalculator />} /> */}
          <Route
            path="past-rides"
            element={<PastRides currentUser={currentUser} />}
          />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;

import { useState } from "react";
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

// Mock user data
const currentUser = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 234 567 8900",
  rating: 4.8,
  totalRides: 24,
};

// Mock data for rides
const mockUpcomingRides = [
  {
    id: 1,
    from: "University Campus",
    to: "Downtown",
    host: {
      name: "Sarah Wilson",
      phone: "+1 234 567 8901",
      rating: 4.9,
    },
    departureDate: "2024-03-25",
    departureTime: "08:30",
    seats: {
      total: 4,
      available: 2,
    },
    price: 15,
    passengers: [
      {
        id: 1,
        name: "Alice Smith",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      },
      {
        id: 2,
        name: "Bob Johnson",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      },
    ],
  },
];

const mockPastRides = [
  {
    id: 1,
    from: "Downtown",
    to: "University Campus",
    host: {
      name: "Michael Brown",
      rating: 4.7,
    },
    date: "2024-03-10",
    time: "14:30",
    reviewed: false,
  },
  {
    id: 2,
    from: "Airport",
    to: "University Campus",
    host: {
      name: "Emma Davis",
      rating: 4.8,
    },
    date: "2024-03-05",
    time: "09:15",
    reviewed: true,
  },
];

// Mock data for search results
const mockSearchResults = [
  {
    id: 1,
    from: "University Campus",
    to: "Downtown",
    host: {
      name: "John Doe",
      rating: 4.8,
      reviews: [
        { id: 1, text: "Great driver, very punctual", rating: 5 },
        { id: 2, text: "Comfortable ride", rating: 4 },
      ],
      phone: "+1 234 567 8900",
      totalRides: 45,
    },
    seats: {
      total: 4,
      available: 2,
    },
    passengers: [
      {
        id: 1,
        name: "Alice Smith",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      },
      {
        id: 2,
        name: "Bob Johnson",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      },
    ],
    departureTime: "2024-03-20T08:30:00",
    price: 15,
  },
  {
    id: 2,
    from: "Downtown",
    to: "Airport",
    host: {
      name: "Jane Smith",
      rating: 4.5,
      reviews: [
        { id: 1, text: "Very friendly and professional", rating: 5 },
        { id: 2, text: "Clean car and smooth ride", rating: 4 },
      ],
      phone: "+1 234 567 8901",
      totalRides: 32,
    },
    seats: {
      total: 3,
      available: 1,
    },
    passengers: [
      {
        id: 3,
        name: "Charlie Brown",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      },
      {
        id: 4,
        name: "Diana Prince",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      },
    ],
    departureTime: "2024-03-20T09:45:00",
    price: 25,
  },
];

function ReviewModal({ ride, onClose }: { ride: any; onClose: () => void }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    console.log("Submitting review:", { rating, review });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold text-gray-900">Review Your Ride</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">Ride with {ride.host.name}</p>
          <p className="text-gray-600">
            {ride.from} → {ride.to}
          </p>
        </div>

        <div className="mb-6">
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
    </div>
  );
}

function RideCard({
  ride,
  onClose,
  onBook,
}: {
  ride: any;
  onClose: () => void;
  onBook: () => void;
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
              {ride.from} → {ride.to}
            </div>
            <div className="text-gray-600">
              Departure: {new Date(ride.departureTime).toLocaleString()}
            </div>
            <div className="text-lg font-semibold text-indigo-600 mt-2">
              ${ride.price}
            </div>
          </div>

          {/* Host Information */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">About the Host</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-medium text-gray-900">
                    {ride.host.name}
                  </div>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{ride.host.rating}</span>
                    <span className="text-gray-600 ml-2">
                      ({ride.host.totalRides} rides)
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Recent Reviews
                </div>
                {ride.host.reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="border-t border-gray-200 py-2"
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{review.text}</p>
                  </div>
                ))}
              </div>
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
                    {ride.seats.available} / {ride.seats.total}
                  </div>
                </div>
                <button
                  onClick={onBook}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Book Now
                </button>
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Other Passengers
                </div>
                <div className="flex flex-wrap gap-3">
                  {ride.passengers.map((passenger: any) => (
                    <div key={passenger.id} className="flex items-center gap-2">
                      <img
                        src={passenger.avatar}
                        alt={passenger.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-600">
                        {passenger.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateRideForm() {
  const [rideDetails, setRideDetails] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    seats: "4",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating ride:", rideDetails);
    // Add logic to create ride
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
            value={rideDetails.from}
            onChange={(e) =>
              setRideDetails({ ...rideDetails, from: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter pickup location"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Going To
          </label>
          <input
            type="text"
            value={rideDetails.to}
            onChange={(e) =>
              setRideDetails({ ...rideDetails, to: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter destination"
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
            value={rideDetails.time}
            onChange={(e) =>
              setRideDetails({ ...rideDetails, time: e.target.value })
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
            value={rideDetails.seats}
            onChange={(e) =>
              setRideDetails({ ...rideDetails, seats: e.target.value })
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
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [showCreateRide, setShowCreateRide] = useState(false);

  const handleSearch = () => {
    setSearchResults(mockSearchResults);
    setHasSearched(true);
    setShowCreateRide(false);
  };

  const handleCreateRide = () => {
    setShowCreateRide(true);
  };

  const handleBookRide = () => {
    // Add logic to book ride
    console.log("Booking ride:", selectedRide);
    setSelectedRide(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Find a Ride</h2>
        <div className="text-gray-600">Hey, {currentUser.name}!</div>
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
                value={searchParams.from}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, from: e.target.value })
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
                value={searchParams.to}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, to: e.target.value })
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
                      key={result.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer"
                      onClick={() => setSelectedRide(result)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-medium text-gray-900">
                            {result.from} → {result.to}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">
                              {result.host.name}
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              {new Date(
                                result.departureTime
                              ).toLocaleTimeString()}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{result.seats.available} seats left</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-indigo-600">
                            ${result.price}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">
                              {result.host.rating}
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
        <CreateRideForm />
      )}
    </div>
  );
}

function UpcomingRides() {
  const [rides, setRides] = useState(mockUpcomingRides);

  const handleCancelRide = (rideId: number) => {
    setRides(rides.filter((ride) => ride.id !== rideId));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upcoming Rides</h2>
        <div className="text-gray-600">Hey, {currentUser.name}!</div>
      </div>

      {rides.length > 0 ? (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium text-gray-900">
                    {ride.from} → {ride.to}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <div>Date: {ride.departureDate}</div>
                    <div>Time: {ride.departureTime}</div>
                    <div className="mt-2">
                      <span className="font-medium">
                        Host: {ride.host.name}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current inline-block mr-1" />
                        {ride.host.rating}
                      </span>
                    </div>
                    <div className="mt-2">
                      <Phone className="w-4 h-4 inline-block mr-2" />
                      {ride.host.phone}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleCancelRide(ride.id)}
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
    </div>
  );
}

function PastRides() {
  const [selectedRide, setSelectedRide] = useState<any>(null);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Past Rides</h2>
        <div className="text-gray-600">Hey, {currentUser.name}!</div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-600">
            {mockPastRides.length}
          </div>
          <div className="text-sm text-indigo-600">Completed Rides</div>
        </div>
      </div>

      <div className="space-y-4">
        {mockPastRides.map((ride) => (
          <div key={ride.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-medium text-gray-900">
                  {ride.from} → {ride.to}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <div>Date: {ride.date}</div>
                  <div>Time: {ride.time}</div>
                  <div className="mt-2">
                    <span className="font-medium">Host: {ride.host.name}</span>
                    <span className="mx-2">•</span>
                    <span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current inline-block mr-1" />
                      {ride.host.rating}
                    </span>
                  </div>
                </div>
              </div>
              {!ride.reviewed && (
                <button
                  onClick={() => setSelectedRide(ride)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Leave Review
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
        />
      )}
    </div>
  );
}

function CostCalculator() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cost Calculator</h2>
        <div className="text-gray-600">Hey, {currentUser.name}!</div>
      </div>
      {/* Add calculator component here */}
    </div>
  );
}

function Profile() {
  const [profileData, setProfileData] = useState({
    name: currentUser.name,
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
        <div className="text-gray-600">Hey, {currentUser.name}!</div>
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
              <span className="text-lg font-medium">{currentUser.rating}</span>
              <span className="text-sm text-gray-600">
                ({currentUser.totalRides} rides)
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
      <aside
        className={`w-64 bg-white border-r border-gray-200 p-4 ${
          isSidebarOpen ? "" : "hidden"
        }`}
      >
        <div className="flex items-center space-x-2 mb-8">
          <Car className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">UniRide</span>
        </div>

        <nav className="space-y-2">
          <NavItem to="/dashboard" icon={Car}>
            Take A Ride
          </NavItem>
          <NavItem to="/dashboard/upcoming" icon={Calendar}>
            Upcoming Rides
          </NavItem>
          <NavItem to="/dashboard/calculator" icon={Calculator}>
            Calculator
          </NavItem>
          <NavItem to="/dashboard/past-rides" icon={Clock}>
            Past Rides
          </NavItem>
          <NavItem to="/dashboard/profile" icon={User}>
            Profile
          </NavItem>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mt-auto absolute bottom-4 w-[calc(100%-2rem)]"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <Routes>
          <Route index element={<TakeARide />} />
          <Route path="upcoming" element={<UpcomingRides />} />
          <Route path="calculator" element={<CostCalculator />} />
          <Route path="past-rides" element={<PastRides />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;

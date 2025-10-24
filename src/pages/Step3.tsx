import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ArrowLeft, MapPin, Star, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface Place {
  city: string;
  place_name: string;
  category: string;
  description: string;
  image: string;
  rating: number;
}

const ALL_PLACES_DATA: Place[] = [
  { "city": "Andaman", "place_name": "Radhanagar Beach", "category": "Beaches 🏖️", "description": "Famous for its sunset views and soft white sand on Havelock Island.", "image": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Radhanagar_Beach.jpg", "rating": 4.9 },
  { "city": "Andaman", "place_name": "Elephant Beach", "category": "Beaches 🏖️", "description": "Adventure hotspot known for snorkeling and coral reefs.", "image": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Elephant_Beach_Havelock.jpg", "rating": 4.7 },
  { "city": "Andaman", "place_name": "Cellular Jail", "category": "Historical 🏰", "description": "Iconic colonial prison and Indian freedom struggle site.", "image": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Cellular_Jail_Port_Blair.jpg", "rating": 4.8 },
  { "city": "Andaman", "place_name": "Ross Island", "category": "Islands 🏝️", "description": "Historical island with British ruins and peacocks.", "image": "https://upload.wikimedia.org/wikipedia/commons/d/d2/Ross_Island_Andaman.jpg", "rating": 4.8 },
  { "city": "Andaman", "place_name": "Mount Harriet National Park", "category": "Nature & Wildlife 🌿", "description": "Scenic mountain trails and lush green landscapes.", "image": "https://upload.wikimedia.org/wikipedia/commons/8/8f/Mount_Harriet_Andaman.jpg", "rating": 4.6 },

  { "city": "Manali", "place_name": "Rohtang Pass", "category": "Mountains & Valleys 🏔", "description": "High mountain pass offering panoramic views and snow adventures.", "image": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Kullu_Valley_from_Rohtang_Pass%2C_India.jpg", "rating": 4.8 },
  { "city": "Manali", "place_name": "Solang Valley", "category": "Adventure Sports 🧗‍♂️", "description": "Adventure and skiing hub surrounded by majestic peaks.", "image": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Solang_Valley_%2CManali%2C_Himachal_Pardes%2C_India.JPG", "rating": 4.7 },
  { "city": "Manali", "place_name": "Hadimba Temple", "category": "Historical & Cultural 🏰", "description": "Ancient wooden temple dedicated to Goddess Hadimba Devi.", "image": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Devi_Hidimba_Temple_Manali.jpg", "rating": 4.7 },
  { "city": "Manali", "place_name": "Café 1947", "category": "Cafes & Nightlife ☕", "description": "Iconic riverside café in Old Manali serving Italian cuisine.", "image": "https://media-cdn.tripadvisor.com/media/photo-s/12/f9/c3/83/cafe-1947.jpg", "rating": 4.6 },
  { "city": "Manali", "place_name": "Mall Road", "category": "Local Markets & Shopping 🛍", "description": "Main shopping street for woollens, souvenirs, and local food.", "image": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Mall_Road%2C_Manali.jpg", "rating": 4.6 },

  { "city": "Chikmagalur", "place_name": "Mullayanagiri", "category": "Mountains & Hills ⛰️", "description": "Highest peak in Karnataka at 1,930m with stunning panoramic views.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Mullayanagiri_Peak.jpg/1280px-Mullayanagiri_Peak.jpg", "rating": 4.9 },
  { "city": "Chikmagalur", "place_name": "Baba Budangiri", "category": "Mountains & Hills ⛰️", "description": "Mountain range with caves and shrine, known for scenic beauty.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Bababudangiri_Hills_CKM.jpg/1024px-Bababudangiri_Hills_CKM.jpg", "rating": 4.7 },
  { "city": "Chikmagalur", "place_name": "Hirekolale Lake", "category": "Lakes & Water Bodies 🏞️", "description": "Picturesque man-made lake with stunning mountain backdrop.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hirekolale_Lake_CKM.jpg/1280px-Hirekolale_Lake_CKM.jpg", "rating": 4.6 },
  { "city": "Chikmagalur", "place_name": "Belavadi Veeranarayana Temple", "category": "Historical & Heritage 🏰", "description": "Hoysala architectural marvel with intricate stone carvings.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Veera_Narayana_temple_at_Belavadi.jpg/1280px-Veera_Narayana_temple_at_Belavadi.jpg", "rating": 4.6 },
  { "city": "Chikmagalur", "place_name": "Hebbe Falls", "category": "Adventure & Trekking 🥾", "description": "Spectacular waterfall accessible via jeep ride through coffee estates.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Hebbe_falls_kemmangundi.jpg/1024px-Hebbe_falls_kemmangundi.jpg", "rating": 4.7 },
  { "city": "Chikmagalur", "place_name": "Coffee Museum", "category": "Coffee Culture & Plantations ☕", "description": "Interactive museum showcasing history and process of coffee.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Coffee_Board_Museum_Chikmagalur.jpg/1024px-Coffee_Board_Museum_Chikmagalur.jpg", "rating": 4.5 },
  { "city": "Chikmagalur", "place_name": "Belur Chennakeshava Temple", "category": "Historical & Heritage 🏰", "description": "Stunning 12th-century Hoysala temple known for intricate carvings.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Chennakesava_Temple_at_Belur.jpg/1280px-Chennakesava_Temple_at_Belur.jpg", "rating": 4.7 },

  { "city": "Bihar", "place_name": "Nalanda University Ruins", "category": "Heritage & Historical 🏯", "description": "Ancient Buddhist university and UNESCO World Heritage Site.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nalanda_University_Ruins_Bihar.jpg/1280px-Nalanda_University_Ruins_Bihar.jpg", "rating": 4.8 },
  { "city": "Bihar", "place_name": "Mahabodhi Temple, Bodh Gaya", "category": "Spiritual & Religious 🛕", "description": "UNESCO site where Lord Buddha attained enlightenment.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Mahabodhi_Temple_Complex_in_Bodh_Gaya_004.jpg/1024px-Mahabodhi_Temple_Complex_in_Bodh_Gaya_004.jpg", "rating": 4.9 },
  { "city": "Bihar", "place_name": "Valmiki Tiger Reserve", "category": "Nature & Wildlife 🌿", "description": "Bihar's only tiger reserve, home to tigers, leopards, and elephants.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Valmiki_National_Park_3.jpg/1024px-Valmiki_National_Park_3.jpg", "rating": 4.7 },
  { "city": "Bihar", "place_name": "Litti Chokha Stalls, Patna", "category": "Food & Culture 🍲", "description": "Street-side delicacies representing the true flavor of Bihar.", "image": "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg", "rating": 4.7 }
];

export default function Step3() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [matchedPlaces, setMatchedPlaces] = useState<Place[]>([]);
  const [otherPlaces, setOtherPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      toast.error("Please login to continue");
      navigate("/auth?mode=login");
      return;
    }

    const step1Data = localStorage.getItem("step1Data");
    const step2Data = localStorage.getItem("step2Data");

    if (!step1Data || !step2Data) {
      toast.error("Please complete previous steps");
      navigate("/step1");
      return;
    }

    const data1 = JSON.parse(step1Data);
    const data2 = JSON.parse(step2Data);

    setDestination(data1.destination);
    setInterests(data2.interests);

    const cityPlaces = ALL_PLACES_DATA.filter(
      place => place.city.toLowerCase() === data1.destination.toLowerCase()
    );

    const matched: Place[] = [];
    const others: Place[] = [];

    cityPlaces.forEach(place => {
      if (data2.interests.includes(place.category)) {
        matched.push(place);
      } else {
        others.push(place);
      }
    });

    setMatchedPlaces(matched);
    setOtherPlaces(others);

    const allPlaceNames = cityPlaces.map(p => p.place_name);
    setSelectedPlaces(allPlaceNames);
  }, [navigate]);

  const togglePlace = (placeName: string) => {
    setSelectedPlaces(prev =>
      prev.includes(placeName)
        ? prev.filter(p => p !== placeName)
        : [...prev, placeName]
    );
  };

  const toggleSelectAll = () => {
    const allPlaces = [...matchedPlaces, ...otherPlaces];
    if (selectedPlaces.length === allPlaces.length) {
      setSelectedPlaces([]);
    } else {
      setSelectedPlaces(allPlaces.map(p => p.place_name));
    }
  };

  const handleContinue = () => {
    if (selectedPlaces.length === 0) {
      toast.error("Please select at least one place");
      return;
    }

    localStorage.setItem("step3Data", JSON.stringify({ places: selectedPlaces }));
    toast.success("Your personalized itinerary is ready!");
    navigate("/");
  };

  const allPlaces = [...matchedPlaces, ...otherPlaces];
  const allSelected = selectedPlaces.length === allPlaces.length && allPlaces.length > 0;

  const PlaceCard = ({ place }: { place: Place }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass border border-white/20 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300 group"
    >
      <div className="flex gap-4 p-4">
        <div
          className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
          onClick={() => togglePlace(place.place_name)}
        >
          <img
            src={place.image}
            alt={place.place_name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedPlaces.includes(place.place_name)
                  ? "bg-cyan-400 border-cyan-400"
                  : "bg-white/20 border-white/60"
              }`}
            >
              {selectedPlaces.includes(place.place_name) && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-cyan-400 transition-colors">
              {place.place_name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-cyan-400 whitespace-nowrap">
              <Star className="w-4 h-4 fill-cyan-400" />
              <span>{place.rating}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{place.description}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <AnimatedBackground />

      <div className="fixed top-0 left-0 right-0 z-40 glass-strong border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Button
            variant="ghost"
            className="text-foreground hover:text-cyan-400"
            onClick={() => navigate("/step2")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-sm text-muted-foreground hidden sm:inline">Step 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-sm text-muted-foreground hidden sm:inline">Step 2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm text-muted-foreground hidden sm:inline">Step 3</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gradient-hero mb-2">
                {destination}
              </h1>
              <p className="text-muted-foreground">
                Select places you'd like to visit on your journey
              </p>
            </motion.div>

            <div className="space-y-8">
              {interests.map((interest, idx) => {
                const placesInCategory = matchedPlaces.filter(p => p.category === interest);
                if (placesInCategory.length === 0) return null;

                return (
                  <motion.div
                    key={interest}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="text-cyan-400">{interest}</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        ({placesInCategory.length})
                      </span>
                    </h2>
                    <div className="space-y-3">
                      {placesInCategory.map(place => (
                        <PlaceCard key={place.place_name} place={place} />
                      ))}
                    </div>
                  </motion.div>
                );
              })}

              {otherPlaces.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: interests.length * 0.1 }}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span>Other Places</span>
                    <span className="text-sm text-muted-foreground font-normal">
                      ({otherPlaces.length})
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {otherPlaces.map(place => (
                      <PlaceCard key={place.place_name} place={place} />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <GlassCard variant="strong" className="p-6 h-[600px] flex items-center justify-center border border-cyan-400/30">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">Map View</p>
                  <p className="text-sm text-muted-foreground/60 mt-2">
                    Interactive map coming soon
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-sm text-foreground hover:text-cyan-400 transition-colors"
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  allSelected ? "bg-cyan-400 border-cyan-400" : "border-white/60"
                }`}
              >
                {allSelected && <Check className="w-4 h-4 text-white" />}
              </div>
              <span>
                Select all ({selectedPlaces.length}/{allPlaces.length} selected)
              </span>
            </button>

            <Button
              onClick={handleContinue}
              disabled={selectedPlaces.length === 0}
              className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white px-8 py-5 shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <motion.span
                className="inline-block ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

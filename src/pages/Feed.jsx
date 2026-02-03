import { useEffect, useRef, useState, useCallback } from "react";
import API from "../api/api";
import UserCard from "../components/UserCard";
import Container from "../layout/Container";

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [filter, setFilter] = useState({
    casteMode: "any",
    ageMin: "",
    ageMax: "",
    city: "",
  });

  const observer = useRef(null);
  const lastUserRef = useRef(null);
  const isFetchingRef = useRef(false); // 🔒 LOCK

  const token = localStorage.getItem("token");

  // 🔐 Auth check
  useEffect(() => {
    if (!token) window.location.href = "/login";
  }, [token]);

  // 📡 SAFE FETCH FUNCTION
  const fetchUsers = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res = await API.get("/users/match/feed", {
        params: {
          ...filter,
          mode: "random",
          limit: 5,
        },
      });

      const data = res.data || [];

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setUsers(prev => {
          const ids = new Set(prev.map(u => u._id));
          const unique = data.filter(u => !ids.has(u._id));
          return [...prev, ...unique];
        });
      }
    } catch (err) {
      console.error("Feed error:", err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [filter, hasMore]);

  // 🔁 Reset on filter change
  // useEffect(() => {
  //   setUsers([]);
  //   setHasMore(true);
  //   isFetchingRef.current = false;
  //   fetchUsers();
  // }, [filter, fetchUsers]);

  useEffect(() => {
  setUsers([]);
  setHasMore(true);
  isFetchingRef.current = false;

  // 🔒 Only fetch once after reset
  setTimeout(() => {
    if (hasMore) fetchUsers();
  }, 0);
  }, [filter]);

  

  // 👀 Infinite Scroll (FIXED)
useEffect(() => {
  if (!hasMore) {
    observer.current?.disconnect();
    return;
  }

  if (!lastUserRef.current) return;

  if (observer.current) observer.current.disconnect();

  observer.current = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
      fetchUsers();
      }

    },
    { threshold: 0.7 }
  );

  observer.current.observe(lastUserRef.current);

  return () => observer.current?.disconnect();
}, [fetchUsers, hasMore, users.length]);

  // console.log(users);

  return (
    <Container>
      <h2 className="text-2xl text-center font-bold text-pink-600 mb-4">
        Match Feed
      </h2>

      {/* 🔥 FILTER UI */}
      <div className="bg-pink-600 rounded-lg p-2 grid lg:flex gap-3 mb-6">
        <select
          className="border p-2 rounded"
          value={filter.casteMode}
          onChange={e =>
            setFilter({ ...filter, casteMode: e.target.value })
          }
        >
          <option value="any">Any Caste</option>
          <option value="same">Same Caste</option>
          <option value="inter">Inter Caste</option>
        </select>

        <input
          type="number"
          placeholder="Age Min"
          className="border p-2 rounded w-24"
          value={filter.ageMin}
          onChange={e =>
            setFilter({ ...filter, ageMin: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Age Max"
          className="border p-2 rounded w-24"
          value={filter.ageMax}
          onChange={e =>
            setFilter({ ...filter, ageMax: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="City"
          className="border p-2 rounded"
          value={filter.city}
          onChange={e =>
            setFilter({ ...filter, city: e.target.value })
          }
        />
      </div>

      {/* 👤 USER CARDS */}
      {users.map((user, index) => {
        if (index === users.length - 1) {
          return (
            <div ref={lastUserRef} key={user._id}>
              <UserCard user={user} />
            </div>
          );
        }
        return <UserCard key={user._id} user={user} />;
      })}

      {loading && (
        <p className="text-center text-gray-500 mt-4">
          Loading more matches...
        </p>
      )}

      {!hasMore && !loading && (
        <p className="text-center text-gray-400 mt-4">
          No more matches found
        </p>
      )}
     
    </Container>
  );
};

export default Feed;

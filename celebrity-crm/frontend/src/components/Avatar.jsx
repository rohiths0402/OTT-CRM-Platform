import { useEffect, useState } from "react";
import { getPhotos, photoUrl } from "../api/photoApi";

export default function Avatar({ name, className = "h-10 w-10" }) {
  const [photoId, setPhotoId] = useState(null);

  useEffect(() => {
    const load = () =>
      getPhotos()
        .then((res) => setPhotoId(res.data.length > 0 ? res.data[0].id : null))
        .catch(() => setPhotoId(null));

    load();
    window.addEventListener("photos-changed", load);
    return () => window.removeEventListener("photos-changed", load);
  }, []);

  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full border border-gold-400/40 bg-ink-800 text-sm font-semibold text-gold-300 ${className}`}
    >
      {photoId ? (
        <img src={photoUrl(photoId)} alt={name} className="h-full w-full object-cover" />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </span>
  );
}
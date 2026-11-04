import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Camera, Loader2, Trash2, UserRound } from "lucide-react";
import { deletePhoto, getPhotos, photoUrl, uploadPhoto } from "../api/photoApi";
import { shrinkImage } from "../utils/image";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const iconButton =
  "grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-ink-950/60 text-ivory backdrop-blur transition duration-200 hover:border-gold-400/60 hover:text-gold-300 disabled:opacity-60";

export default function PhotoCard({ name }) {
  const [photos, setPhotos] = useState([]);
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const fileInput = useRef(null);

  useEffect(() => {
    getPhotos()
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.photos || res.data?.content || [];
        setPhotos(data);
        setActive(0);
      })
      .catch(() => setError("Could not load photos."));
  }, [version]);

  const changed = () => {
    setVersion((v) => v + 1);
    window.dispatchEvent(new Event("photos-changed"));
  };

  const onPick = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;

    setBusy(true);
    setError("");
    try {
      const small = await shrinkImage(file);
      await uploadPhoto(small);
      changed();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not upload the photo.",
      );
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    const photo = Array.isArray(photos) ? photos[active] : null;
    if (!photo) return;

    setBusy(true);
    setError("");
    try {
      await deletePhoto(photo.id);
      changed();
    } catch {
      setError("Could not delete the photo.");
    } finally {
      setBusy(false);
    }
  };

  const hasPhotos = Array.isArray(photos) && photos.length > 0;

  return (
    <div className="absolute inset-0">
      {hasPhotos ? (
        <Swiper
          key={photos.map((p) => p.id).join("-")}
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          grabCursor
          onSlideChange={(swiper) => setActive(swiper.activeIndex)}
          className="h-full w-full"
          style={{
            "--swiper-pagination-color": "#e0b04a",
            "--swiper-pagination-bullet-inactive-color": "#ffffff",
          }}
        >
          {photos.map((photo) => (
            <SwiperSlide key={photo.id}>
              <img
                src={photoUrl(photo.id)}
                alt={name}
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/60 to-ink-900/10 sm:via-ink-900/25 sm:to-transparent" />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="grid h-full w-full place-items-center text-center">
          <div>
            <UserRound className="mx-auto h-14 w-14 text-gold-400/70" />
            <p className="mt-3 text-xs text-mute">
              Add your photo with the camera button
            </p>
          </div>
        </div>
      )}

      <div className="absolute right-4 top-4 z-20 flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => fileInput.current.click()}
          aria-label="Upload a photo"
          className={iconButton}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </button>
        {hasPhotos && (
          <button
            type="button"
            disabled={busy}
            onClick={onDelete}
            aria-label="Delete this photo"
            className={iconButton}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <p className="absolute bottom-4 right-4 z-20 rounded-lg bg-ink-950/80 px-3 py-1.5 text-xs text-red-400">
          {error}
        </p>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        hidden
        onChange={onPick}
      />
    </div>
  );
}

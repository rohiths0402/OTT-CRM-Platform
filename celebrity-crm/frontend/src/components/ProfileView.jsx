import { useState } from "react";
import {
  Camera,
  Check,
  MapPin,
  Pencil,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";

function resizePhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("We could not read that photo."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Choose a valid image file."));
      image.onload = () => {
        const scale = Math.min(1, 640 / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("We could not process that photo."));
              return;
            }
            const compressedReader = new FileReader();
            compressedReader.onerror = () =>
              reject(new Error("We could not save that photo."));
            compressedReader.onload = () =>
              resolve(String(compressedReader.result));
            compressedReader.readAsDataURL(blob);
          },
          "image/jpeg",
          0.82,
        );
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

const fieldClass =
  "mt-2 w-full rounded-xl border border-line bg-ink-950/70 px-4 py-3 text-sm text-ivory outline-none transition placeholder:text-mute/70 focus:border-gold-400/60";

export default function ProfileView({ user, onSave }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
    instagram: user?.instagram || "",
    youtube: user?.youtube || "",
    profilePhoto: user?.profilePhoto || "",
  });
  const [editing, setEditing] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const choosePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPhotoError("");
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError("Choose an image smaller than 10 MB.");
      return;
    }
    try {
      update("profilePhoto", await resizePhoto(file));
    } catch (photoLoadError) {
      setPhotoError(photoLoadError.message);
    }
  };

  const save = (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Your display name is required.");
      return;
    }
    try {
      onSave({
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        bio: form.bio.trim(),
        instagram: form.instagram.trim(),
        youtube: form.youtube.trim(),
      });
      setError("");
      setSaved(true);
      setEditing(false);
    } catch {
      setError("We could not save your profile. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-gold-400/20 bg-gradient-to-br from-[#32251b] via-ink-900 to-[#17121c] p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-7 md:flex-row md:items-end">
          <div className="relative mx-auto shrink-0 md:mx-0">
            <div className="h-32 w-32 overflow-hidden rounded-[2rem] border border-gold-300/50 bg-ink-800 shadow-[0_20px_70px_-20px_rgba(217,162,43,0.5)] sm:h-40 sm:w-40">
              {form.profilePhoto ? (
                <img
                  src={form.profilePhoto}
                  alt={`${form.name || "Your"} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-to-br from-gold-400/25 to-ink-800 font-display text-6xl text-gold-300">
                  {(form.name || "C").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {editing && (
              <label className="absolute -bottom-3 -right-3 grid h-11 w-11 cursor-pointer place-items-center rounded-2xl border border-line bg-ink-800 text-gold-300 shadow-xl transition hover:border-gold-400/60 hover:bg-ink-700">
                <Camera className="h-5 w-5" />
                <span className="sr-only">Upload profile photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={choosePhoto}
                  className="sr-only"
                />
              </label>
            )}
          </div>
          <div className="min-w-0 flex-1 text-center md:text-left">
            <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.24em] text-gold-300 md:justify-start">
              <UserRound className="h-4 w-4" />
              Talent profile
            </div>
            <h2 className="mt-3 break-words font-display text-4xl font-light text-ivory sm:text-5xl">
              {form.name || "Your name"}
            </h2>
            <p className="mt-2 text-sm text-mute">
              {form.location || "Add your home base"}
              {user?.email ? ` · ${user.email}` : ""}
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-ivory/75 md:mx-0">
              {form.bio || "Add a short introduction to make your profile yours."}
            </p>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={() => {
                setSaved(false);
                setEditing(true);
              }}
              className="mx-auto inline-flex items-center gap-2 rounded-xl border border-gold-400/30 bg-gold-400/10 px-4 py-2.5 text-sm font-medium text-gold-300 transition hover:bg-gold-400/15 md:mx-0"
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </button>
          )}
        </div>
        <div className="relative mt-8 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
          <div className="flex items-center gap-3 text-sm text-mute">
            <ShieldCheck className="h-4 w-4 text-aqua-400" />
            Private talent profile
          </div>
          <div className="flex items-center gap-3 text-sm text-mute">
            <MapPin className="h-4 w-4 text-gold-300" />
            {form.location || "Location not set"}
          </div>
          <div className="flex items-center gap-3 text-sm text-mute">
            <FaInstagram className="h-4 w-4 text-rose-400" />
            {form.instagram ? `@${form.instagram.replace(/^@/, "")}` : "Social links"}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-ink-900 p-5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-300">
              Profile details
            </p>
            <h3 className="mt-2 font-display text-2xl text-ivory">
              Your professional presence
            </h3>
            <p className="mt-1 text-sm text-mute">
              Keep your contact and public profile details up to date.
            </p>
          </div>
          {saved && (
            <span
              role="status"
              className="inline-flex items-center gap-2 rounded-full border border-aqua-400/25 bg-aqua-400/10 px-3 py-1.5 text-xs text-aqua-400"
            >
              <Check className="h-3.5 w-3.5" />
              Saved
            </span>
          )}
        </div>

        <form onSubmit={save} className="mt-6">
          <fieldset disabled={!editing} className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-mute">
              Display name
              <input
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Your professional name"
                className={fieldClass}
              />
            </label>
            <label className="text-xs text-mute">
              Email address
              <input
                value={user?.email || ""}
                readOnly
                className={`${fieldClass} cursor-not-allowed opacity-60`}
              />
              <span className="mt-1 block text-[11px]">
                Sign-in email is managed by your account.
              </span>
            </label>
            <label className="text-xs text-mute">
              Phone
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="+91 98765 43210"
                className={fieldClass}
              />
            </label>
            <label className="text-xs text-mute">
              Based in
              <input
                value={form.location}
                onChange={(event) => update("location", event.target.value)}
                placeholder="Chennai, India"
                className={fieldClass}
              />
            </label>
            <label className="text-xs text-mute">
              Instagram username
              <input
                value={form.instagram}
                onChange={(event) => update("instagram", event.target.value)}
                placeholder="@yourhandle"
                className={fieldClass}
              />
            </label>
            <label className="text-xs text-mute">
              YouTube channel
              <input
                value={form.youtube}
                onChange={(event) => update("youtube", event.target.value)}
                placeholder="Channel name or URL"
                className={fieldClass}
              />
            </label>
            <label className="text-xs text-mute sm:col-span-2">
              Short introduction
              <textarea
                rows={3}
                value={form.bio}
                onChange={(event) => update("bio", event.target.value)}
                placeholder="A short introduction for your professional profile"
                className={`${fieldClass} resize-y`}
              />
            </label>
          </fieldset>

          {(error || photoError) && (
            <p role="alert" className="mt-4 text-sm text-rose-400">
              {error || photoError}
            </p>
          )}

          {editing && (
            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-line pt-5">
              <button
                type="button"
                onClick={() => {
                  setForm({
                    name: user?.name || "",
                    phone: user?.phone || "",
                    location: user?.location || "",
                    bio: user?.bio || "",
                    instagram: user?.instagram || "",
                    youtube: user?.youtube || "",
                    profilePhoto: user?.profilePhoto || "",
                  });
                  setEditing(false);
                  setError("");
                  setPhotoError("");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm text-mute transition hover:text-ivory"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="gold-btn inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
              >
                <Check className="h-4 w-4" />
                Save profile
              </button>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

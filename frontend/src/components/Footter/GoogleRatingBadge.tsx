import { useEffect } from "react";

const GoogleRatingBadge: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js?onload=renderBadge";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).renderBadge = () => {
      const container = document.createElement("div");
      container.id = "google-rating-badge";
      document.body.appendChild(container);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).gapi) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gapi.load("ratingbadge", function () {
          // тільки бейдж магазину, без GTIN
          (window as any).gapi.ratingbadge.render(container, {
            merchant_id: 5655937585
          });
        });
      }
    };

    return () => {
      document.body.removeChild(script);
      const existing = document.getElementById("google-rating-badge");
      if (existing) document.body.removeChild(existing);
    };
  }, []);

  return null;
};

export default GoogleRatingBadge;


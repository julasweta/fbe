export const generateMetaData = (data: {
  title: string;
  description: string;
  image?: string;
  path?: string;
}) => {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://fbe.pp.ua/";

  return {
    title: data.title,
    description:
      data.description.length > 160
        ? data.description.substring(0, 157) + "..."
        : data.description,
    image: data.image ? data.image : `${baseUrl}/og-default.jpg`,
    url: `${baseUrl}${data.path || ""}`,
    siteName: "FBE Store",
  };
};

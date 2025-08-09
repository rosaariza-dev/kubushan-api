export const formatImageResponse = (cloudinaryResult) => {
  if (!cloudinaryResult) return null;
  
  const {
    public_id,
    display_name,
    secure_url,
    url,
    format,
    width,
    height,
    resource_type,
    asset_folder
  } = cloudinaryResult;
  
  return {
    public_id,
    display_name,
    secure_url,
    url,
    format,
    width,
    height,
    resource_type,
    asset_folder
  };
};
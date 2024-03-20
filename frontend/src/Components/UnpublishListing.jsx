import { getCall, putCall } from '../fetch';

const UnpublishListing = async (listing, setListings) => {
  try {
    const token = localStorage.getItem('token');
    const selectedListing = await getCall(`/listings/${listing.id}`, token);

    if (selectedListing && selectedListing.listing) {
      const isPublished = selectedListing.listing.published;

      if (isPublished) {
        // Unpublish the listing
        const updatedListingData = { ...selectedListing.listing, published: false };
        await putCall(`/listings/unpublish/${listing.id}`, updatedListingData, token);
      } else {
        // Publish the listing
        const updatedListingData = { ...selectedListing.listing, published: true };
        await putCall(`/listings/publish/${listing.id}`, updatedListingData, token);
      }

      // Update the state
      setListings((prevListings) =>
        prevListings.map((prevListing) =>
          prevListing.id === listing.id ? { ...prevListing, published: !isPublished } : prevListing
        )
      );
    } else {
      console.error('ERROR: Listing data');
    }
  } catch (error) {
    console.error('Can\'t unpublish:', error);
  }
};

export default UnpublishListing;

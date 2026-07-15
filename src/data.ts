import { RoomType, Facility, GalleryItem } from './types';

// Scan all room images and gallery images dynamically
const globRoomImages = (import.meta as any).glob('../images/rooms/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', { eager: true });
const globGalleryImages = (import.meta as any).glob('../images/gallery/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', { eager: true });

export function getRoomImages(folderName: string, coverFilename: string): string[] {
  // Support both short folder names (sf1, df1, sd2, t3) and more descriptive ones
  const possibleFolders = [folderName];
  if (folderName === 'sf1') possibleFolders.push('standard-family', 'standard-family-room');
  if (folderName === 'df1') possibleFolders.push('deluxe-family', 'deluxe-family-room');
  if (folderName === 'sd2') possibleFolders.push('superior-deluxe', 'superior-deluxe-double');
  if (folderName === 't3') possibleFolders.push('triple', 'triple-room');

  // Find all matched images for this folder
  const matchingUrls = Object.keys(globRoomImages)
    .filter(key => {
      const parts = key.split('/');
      return possibleFolders.some(folder => {
        const idx = parts.indexOf(folder);
        return idx !== -1 && idx === parts.length - 2;
      });
    })
    .map(key => {
      const mod = globRoomImages[key] as any;
      return mod.default || mod;
    });

  // If no matching images found in the glob, return the fallback static coverPath
  if (matchingUrls.length === 0) {
    return [`/images/rooms/${folderName}/${coverFilename}`];
  }

  // Deduplicate and naturally sort all matching URLs alphabetically
  const sorted = Array.from(new Set(matchingUrls)).sort((a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });

  // Find the cover image in the sorted list to place it at the very beginning
  const coverLower = coverFilename.toLowerCase();
  const coverBase = coverLower.split('.')[0];
  const coverIndex = sorted.findIndex(url => {
    const filename = url.split('/').pop()?.toLowerCase() || '';
    return filename.includes(coverLower) || filename.startsWith(coverBase);
  });

  if (coverIndex !== -1) {
    const [cover] = sorted.splice(coverIndex, 1);
    return [cover, ...sorted];
  }

  return sorted;
}

export function getGalleryItems(): GalleryItem[] {
  return Object.keys(globGalleryImages)
    .sort((a, b) => a.localeCompare(b))
    .map(key => {
      const mod = globGalleryImages[key] as any;
      const src = mod.default || mod;
      
      // Determine category from folder name
      const parts = key.split('/');
      const galleryIndex = parts.indexOf('gallery');
      let category = 'all';
      if (galleryIndex !== -1 && parts.length > galleryIndex + 2) {
        category = parts[galleryIndex + 1].toLowerCase();
      }
      
      return {
        src,
        category
      };
    });
}

export const FACILITIES: Facility[] = [
  {
    name: 'Swimming Pool',
    icon: 'Waves',
    description: 'A beautifully designed outdoor pool with clean, filtered water, suitable for adults and kids.'
  },
  {
    name: 'Rain Dance',
    icon: 'Sparkles',
    description: 'Immersive rain dance system with music, perfect for families and corporate groups to unwind.'
  },
  {
    name: 'Indoor Games',
    icon: 'Gamepad2',
    description: 'Recreational play area featuring carrom, chess, board games, and table tennis.'
  },
  {
    name: 'Family Rooms',
    icon: 'Users',
    description: 'Spacious and comfortable multi-bed accommodations designed specifically for families.'
  },
  {
    name: 'Parking',
    icon: 'Car',
    description: 'Secure, ample, and free on-site parking for guest vehicles and private tourist buses.'
  }
];

export const ROOMS: RoomType[] = [
  {
    id: 'standard-family-room',
    name: 'Standard Family Room',
    price: 4084,
    occupancy: '2 Adults',
    size: '380 sq.ft.',
    facilities: ['Swimming Pool Access', 'Rain Dance', 'Indoor Games', 'Free High-speed Wi-Fi', 'Hot Water', 'Ensuite Bathroom', 'LED TV'],
    description: 'An exceptionally spacious room equipped with a comfortable double-bed, perfect for couples seeking absolute comfort and a relaxing stay.',
    longDescription: 'Our Standard Family Room provides a highly functional, comfortable staying option for up to two guests. Nestled in a quiet corner of the resort, it features one double bed with cozy bedsheets, a spacious layout, and modern bathroom fittings. Guests enjoy direct proximity to our swimming pool and recreation zones.',
    amenities: [
      '1 Double Bed',
      'Flat-screen LED TV',
      'Attached modern bathroom',
      'Geyser for 24/7 hot water',
      'Fresh linens & towels',
      'Daily housekeeping',
      'Ceiling fan & ventilation',
      'Complementary bottled water'
    ],
    images: getRoomImages('sf1', 'sf1.jpeg')
  },
  {
    id: 'deluxe-family-room',
    name: 'Deluxe Family Room',
    price: 4749,
    occupancy: '2 Adults',
    size: '420 sq.ft.',
    facilities: ['Swimming Pool Access', 'Rain Dance', 'Indoor Games', 'Free High-speed Wi-Fi', 'Hot Water', 'Ensuite Bathroom', 'LED TV', 'Balcony / Veranda View'],
    description: 'Upgraded spaciousness featuring a custom private balcony overlooking the resort pool and beautiful gardens.',
    longDescription: 'The Deluxe Family Room elevates your Coorg vacation experience with comfort, elegant wooden cabinetry, and an exquisite balcony. Outfitted with wooden false ceilings, cozy lighting, and a state-of-the-art double bed, it delivers relaxation for couples and business travelers.',
    amenities: [
      '1 Double Bed',
      'Balcony with pool & garden view',
      'Wooden false ceiling with tray lighting',
      'Flat-screen LED TV',
      'Attached bathroom with modern shower',
      'Geyser for hot water',
      'Plush toiletries kit',
      'Tea & Coffee maker',
      'In-room seating lounge'
    ],
    images: getRoomImages('df1', 'df1.jpeg')
  },
  {
    id: 'superior-deluxe-double',
    name: 'Superior Deluxe Double',
    price: 4702,
    occupancy: '4 Adults',
    size: '320 sq.ft.',
    facilities: ['Swimming Pool Access', 'Rain Dance', 'Indoor Games', 'Free High-speed Wi-Fi', 'Hot Water', 'Ensuite Bathroom', 'LED TV', 'Custom Wooden Interiors'],
    description: 'Designed precisely like our flagship ambient master bedroom, featuring false ceilings, glowing warm cove lighting, and rich wood finishes.',
    longDescription: 'Modelled exactly as our showcase room, the Superior Deluxe Double is a peaceful sanctuary for families. It is characterized by detailed rich dark-wood custom headboards, wood-slat false ceilings with a central glow panel, quality tile flooring, and custom curtains.',
    amenities: [
      '2 Double Beds',
      'Flagship wood false ceiling & tray glow lights',
      'Warm ambient wall lamps',
      'Plush custom mattress & headboards',
      'Attached modern bathroom',
      'Tea & Coffee maker',
      'Flat-screen LED TV',
      'In-room seating couch'
    ],
    images: getRoomImages('sd2', 'sd2.jpeg')
  },
  {
    id: 'triple-room',
    name: 'Triple Room',
    price: 5984,
    occupancy: '6 Adults',
    size: '350 sq.ft.',
    facilities: ['Swimming Pool Access', 'Rain Dance', 'Indoor Games', 'Free High-speed Wi-Fi', 'Hot Water', 'Ensuite Bathroom', 'LED TV'],
    description: 'A versatile three-bed config ideal for groups of friends, corporate travelers, or larger family units.',
    longDescription: 'Our Triple Room is configured with three comfortable double beds, solving the multi-person accommodation puzzle elegantly. Brightly lit, airy, and boasting clean tile finishes, it matches convenience with affordable Coorg resort comfort.',
    amenities: [
      '3 Double Beds',
      'Comfortable orthopaedic mattresses',
      'Modern ensuite washroom',
      '24-hour hot water system',
      'Work desk & seating chairs',
      'LED TV',
      'Daily housekeeping'
    ],
    images: getRoomImages('t3', 't3.jpeg')
  }
];

export const GALLERY_ITEMS: GalleryItem[] = getGalleryItems();

export const RESORT_SEO_METADATA = {
  title: 'Dreamy Vacations | Resort in Kushalnagar, Coorg',
  description: 'Dreamy Vacations is a resort located in Kushalnagar, Coorg, offering comfortable rooms for couples, families, and groups. Guests can enjoy our swimming pool, spacious accommodations, and a relaxing stay experience.',
  phone: '+91 99029 60484',
  address: {
    street: '#51/5, Behind Chikkathur Govt School, Chikkathur Village',
    town: 'Kushalnagar, Kudumangalore',
    state: 'Karnataka',
    pincode: '571232',
    country: 'India'
  },
  coordinates: {
    latitude: 12.486260,
    longitude: 75.940539
  }
};

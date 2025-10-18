# SoulWorx Admin Guide

## Overview
The SoulWorx admin panel provides a comprehensive content management system for managing all aspects of your platform.

## Accessing the Admin Panel
1. Sign in with an admin account
2. Navigate to `/dashboard/admin`
3. You'll see the admin dashboard with:
   - Overview statistics
   - Quick actions
   - Navigation to all admin sections

## Admin Sections

### 1. Programs
**Path:** `/dashboard/admin/programs`

Manage your programs and workshops. Programs are the main containers for events.

**Features:**
- Create, edit, and delete programs
- Add cover images and image galleries
- Set program details (duration, age range, capacity, price)
- Add FAQs
- Set registration requirements
- Add tags for organization

**Creating a Program:**
1. Click "+ New Program" 
2. Fill in the required fields:
   - Title (required)
   - Slug (auto-generated, but editable)
   - Description (required)
   - Category (youth, schools, community, workshops, special)
   - Status (draft, published, archived)
3. Add media:
   - Cover image (main program image)
   - Additional images (for gallery)
   - Video URL (YouTube, Vimeo, etc.)
4. Set program details (duration, age range, capacity, price)
5. Add FAQs if needed
6. Click "Create Program"

### 2. Events
**Path:** `/dashboard/admin/events`

Manage individual event sessions for your programs.

**Features:**
- Create, edit, and delete events
- Link events to programs
- Set date, time, and timezone
- Configure location (in-person, virtual, or hybrid)
- Set capacity and enable waitlist
- Add internal notes

**Creating an Event:**
1. Click "+ New Event"
2. Select the parent program
3. Fill in event details:
   - Title (required)
   - Description
   - Status (scheduled, cancelled, completed, postponed)
4. Set date and time:
   - Start time
   - End time
   - Timezone
5. Configure location:
   - **In Person:** Venue name, address, city, state, ZIP
   - **Virtual:** Meeting URL
   - **Hybrid:** Both physical venue and meeting URL
6. Set capacity and waitlist options
7. Add internal notes for organizers
8. Click "Create Event"

### 3. Stories
**Path:** `/dashboard/admin/stories`

Manage all story content including poetry drops, community highlights, event recaps, and press releases.

**Categories:**
- **Poetry Drop:** Poetry content and creative writing
- **Community Highlight:** Community member features and stories
- **Event Recap:** Summaries and recaps of past events
- **Press & Media:** Press releases and media coverage

**Features:**
- Create, edit, and delete stories
- Add cover images
- Rich text content with Markdown support
- Categorization and tagging
- SEO optimization
- Draft/Published/Archived status

**Creating a Story:**
1. Click "+ New Story"
2. Fill in the basic information:
   - Title (required)
   - Slug (auto-generated)
   - Excerpt (short summary)
   - Content (supports Markdown)
   - Category
   - Status
3. Add images:
   - Cover image (main story image)
   - OG image (for social media sharing)
4. Add tags for organization
5. Optionally add SEO metadata
6. Click "Create Story"

### 4. Shop
**Path:** `/dashboard/admin/shop`

Manage your shop products and inventory.

**Features:**
- Create, edit, and delete products
- Multiple product images
- Pricing and inventory management
- Product variants (sizes, colors, etc.)
- Tags and specifications
- Stock tracking

**Creating a Product:**
1. Click "+ Add Product"
2. Fill in basic information:
   - Product name (required)
   - Slug (auto-generated)
   - Description
   - Category (apparel, accessories, books, digital, other)
   - Status (draft, active, sold_out, archived)
3. Set pricing:
   - Price (required)
   - Compare at price (for showing discounts)
   - SKU
   - Stock quantity
4. Add images (multiple images supported)
5. Add tags for organization
6. Click "Create Product"

## Image Management

### Current Setup
The admin forms accept image URLs. You can use images from:

1. **Local `/public` directory:**
   - Place images in `/public/optimized/` for story/program images
   - Place images in `/public/shop/` for product images
   - Reference them as: `/optimized/your-image.jpg` or `/shop/your-image.jpg`

2. **External URLs:**
   - Upload images to your preferred hosting service (Cloudinary, AWS S3, etc.)
   - Use the full URL: `https://your-cdn.com/images/photo.jpg`

### Recommended Image Sizes
- **Program/Story Cover Images:** 1200x800px (3:2 ratio)
- **Product Images:** 1000x1000px (1:1 ratio)
- **Social Media (OG) Images:** 1200x630px (1.91:1 ratio)

### Future Improvements
Consider integrating:
- **Cloudinary:** For advanced image management with automatic optimization
- **AWS S3 + CloudFront:** For scalable image hosting
- **Next.js Image Upload API:** Custom upload endpoint with cloud storage

## Tips & Best Practices

### SEO
- Always fill in meta titles and descriptions for published content
- Use descriptive, keyword-rich titles
- Add alt text to images (use the filename as a guide)
- Keep URLs clean and descriptive

### Content Organization
- Use consistent tagging across content types
- Create drafts before publishing to review content
- Archive old content instead of deleting it
- Use meaningful slugs that reflect the content

### Programs & Events
- Always publish the program before creating events
- Set realistic capacity limits
- Enable waitlists for popular events
- Include complete location details for in-person events
- Test virtual meeting URLs before events

### Shop Management
- Update stock levels regularly
- Use high-quality product images
- Write detailed product descriptions
- Set compare prices to show discounts effectively
- Use consistent product photography

## User Roles

### Admin
- Full access to all admin features
- Can create, edit, and delete all content
- Can manage users (if user management is enabled)

### Super Admin
- Same as Admin
- Additional system-level permissions (if implemented)

## Support & Troubleshooting

### Common Issues

**Build Error: "Module not found"**
- Clear the build cache: `rm -rf .next node_modules/.cache`
- Restart the development server

**Images Not Showing**
- Verify the image URL is correct and accessible
- Check that images in `/public` don't have a leading `/public/` in the URL
- Ensure external images allow cross-origin requests

**Events Not Appearing**
- Check that the parent program is published
- Verify the event date is in the future (for upcoming events)
- Check the event status is set to "scheduled"

**Stories/Products Not Visible**
- Ensure the status is set to "published" or "active"
- Check that all required fields are filled
- Verify the slug is unique

## Database Schema

### Key Tables
- `programs`: Program/workshop containers
- `events`: Individual event sessions
- `posts`: Stories, poetry, announcements, etc.
- `products`: Shop items
- `users`: User accounts
- `rsvps`: Event registrations

All content types include:
- Timestamps (createdAt, updatedAt, publishedAt)
- Status fields (draft, published, archived, etc.)
- SEO metadata fields
- Author/creator tracking

## API Endpoints

All admin operations use RESTful API endpoints:

### Stories
- `POST /api/stories` - Create story
- `PUT /api/stories/[id]` - Update story
- `DELETE /api/stories/[id]` - Delete story

### Programs
- `POST /api/programs` - Create program
- `PUT /api/programs/[id]` - Update program
- `DELETE /api/programs/[id]` - Delete program

### Events
- `POST /api/events` - Create event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### Products
- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

## Next Steps

### Recommended Enhancements
1. **Image Upload:** Integrate Cloudinary or similar service for direct image uploads
2. **Rich Text Editor:** Add a WYSIWYG editor for better content editing
3. **Bulk Operations:** Add ability to bulk edit/delete items
4. **Media Library:** Create a centralized media library for image management
5. **Content Scheduling:** Schedule posts to publish at specific times
6. **Analytics Integration:** Add analytics to track content performance
7. **Export/Import:** Add CSV export/import for bulk data management

---

For technical support or feature requests, please contact the development team.


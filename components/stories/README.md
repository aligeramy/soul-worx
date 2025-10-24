# Story Cards

This directory contains specialized card components for displaying different types of stories in a masonry layout.

## Components

### PoetryCard
- **Size**: 2/3 column span (spans 2 columns in the 3-column grid)
- **Features**:
  - Animated verse display that cycles through verses every 4 seconds
  - Beautiful gradient background (blue → indigo → purple)
  - Pattern overlay for visual interest
  - Verse indicator dots showing current verse
  - Fade in/out animation between verses
  - Split layout with image on left, content on right

### AnnouncementCard
- **Size**: Single column
- **Features**:
  - Eye-catching alert-style design with amber/orange/yellow gradient
  - Megaphone icon and prominent "Announcement" badge
  - Calendar date display
  - Diagonal stripe pattern background
  - Call-to-action button with arrow icon
  - Designed to stand out as official announcements

### BlogCard
- **Size**: Single column
- **Features**:
  - Clean white card design
  - Standard blog post layout
  - Image with gradient overlay
  - Category badge with icons
  - Author info and date display
  - Hover effects

## MasonryGrid
A simple wrapper component that creates a responsive 3-column grid layout with proper spacing.

## Usage

In your stories page, import and use the cards like this:

```tsx
import { PoetryCard } from "@/components/stories/poetry-card"
import { AnnouncementCard } from "@/components/stories/announcement-card"
import { BlogCard } from "@/components/stories/blog-card"
import { MasonryGrid } from "@/components/stories/masonry-grid"

<MasonryGrid>
  {posts.map((post) => {
    if (post.category === "poetry") {
      return <PoetryCard key={post.id} post={post} />
    }
    
    if (post.category === "announcements") {
      return <AnnouncementCard key={post.id} post={post} />
    }
    
    return <BlogCard key={post.id} post={post} />
  })}
</MasonryGrid>
```

## Category-to-Path Mapping

- `poetry` → `/stories/poetry`
- `news` → `/stories/events`
- `blog` → `/stories/blog`
- `announcements` → `/stories/press`
- `tutorials` → `/stories/community`


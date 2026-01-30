import { useState, useEffect } from 'react';
import { getPosts, getPostsByCategory, getPostBySlug } from '../lib/queries';
import type { Post, PostWithAuthor, PostCategory } from '../lib/types';

/**
 * Fetch all published posts
 */
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, refetch: fetchPosts };
}

/**
 * Fetch posts by category
 */
export function usePostsByCategory(category: PostCategory | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    if (!category) {
      setPosts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getPostsByCategory(category);
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  return { posts, loading, error, refetch: fetchPosts };
}

/**
 * Fetch post by slug
 */
export function usePostBySlug(slug: string | null) {
  const [post, setPost] = useState<PostWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPost = async () => {
    if (!slug) {
      setPost(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getPostBySlug(slug);
      setPost(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  return { post, loading, error, refetch: fetchPost };
}




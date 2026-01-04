export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TagWithCount extends Tag {
  _count: {
    posts: number;
  };
}

export interface TagFormData {
  name: string;
  slug: string;
}

export interface PostWithTags {
  tags: {
    tag: Tag;
  }[];
}

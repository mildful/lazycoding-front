import { LitePost } from '../lite-post';

export interface FullPost extends LitePost {
  readonly 'date_gmt': string;
  readonly 'guid': {
    'rendered': string;
  };
  readonly 'modified': string;
  readonly 'modified_gmt': string;
  readonly 'type': string;
  readonly 'link': string;
  readonly 'content': {
    'rendered': string;
  };
  readonly 'excerpt': {
    'rendered': string;
  };
  readonly 'featured_media': number;
  readonly 'comment_status': string;
  readonly 'ping_status': string;
  readonly 'sticky': boolean;
  readonly 'format': string;
  readonly '_links': {
    'self': [
      {
        'href': string;
      }
      ];
    'collection': [
      {
        'href': string;
      }
      ];
    'about': [
      {
        'href': string;
      }
      ];
    'author': [
      {
        'embeddable': boolean;
        'href': string;
      }
      ];
    'replies': [
      {
        'embeddable': boolean;
        'href': string;
      }
      ];
    'version-history': [
      {
        'href': string;
      }
      ];
    'wp:attachment': [
      {
        'href': string;
      }
      ];
    'wp:term': {
      'taxonomy': string;
      'embeddable': boolean;
      'href': string;
    }[];
    'curies': {
      'name': string;
      'href': string;
      'tempalted': boolean;
    }[]
  };
}
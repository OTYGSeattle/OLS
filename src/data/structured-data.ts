import type { CollectionEntry } from 'astro:content';
import site from '../../site.config.mjs';
import {
  docsCategories,
  docsParentCategories,
  docsParentMap,
  getArticleHref,
  getCategoryHref,
  getCleanDocSlug,
  getOrderedDocsForCategory,
} from './docs';

type JsonLdPrimitive = string | number | boolean | null;
export type JsonLdValue = JsonLdPrimitive | JsonLdNode | JsonLdValue[];
export type JsonLdNode = { [key: string]: JsonLdValue | undefined };

export type StructuredDataBreadcrumb = {
  name: string;
  path: string;
};

export type StructuredDataItem = {
  name: string;
  path: string;
};

export type PageStructuredData = {
  type?: 'WebPage' | 'CollectionPage' | 'TechArticle';
  name?: string;
  breadcrumbs?: StructuredDataBreadcrumb[];
  items?: StructuredDataItem[];
  articleSection?: string;
  author?: string;
  tags?: string[];
  updatedAt?: Date;
  parentPath?: string;
};

type PageNodeOptions = PageStructuredData & {
  path: string;
  title: string;
  description: string;
};

const homeUrl = new URL('/', site.siteUrl).toString();
const organizationId = `${homeUrl}#organization`;
const websiteId = `${homeUrl}#website`;
const standardId = `${homeUrl}#standard`;
const ogImageUrl = new URL(site.ogImage, site.siteUrl).toString();

export function getAbsoluteUrl(path: string) {
  return new URL(path, site.siteUrl).toString();
}

function getOrganizationNode(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: site.name,
    url: homeUrl,
    logo: {
      '@type': 'ImageObject',
      url: getAbsoluteUrl('/otyg-app-icon.png'),
    },
    sameAs: [site.githubUrl],
  };
}

function getWebsiteNode(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: homeUrl,
    name: site.title,
    description: site.description,
    inLanguage: 'en',
    publisher: { '@id': organizationId },
    about: { '@id': standardId },
  };
}

function getStandardNode(): JsonLdNode {
  return {
    '@type': 'DigitalDocument',
    '@id': standardId,
    name: site.title,
    alternateName: 'OLS v1.0',
    description: site.description,
    url: homeUrl,
    version: site.standardVersion,
    inLanguage: 'en',
    license: site.licenseUrl,
    publisher: { '@id': organizationId },
    isPartOf: { '@id': websiteId },
  };
}

function getBreadcrumbNode(pageUrl: string, breadcrumbs: StructuredDataBreadcrumb[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: getAbsoluteUrl(breadcrumb.path),
    })),
  };
}

function getItemListNode(pageUrl: string, items: StructuredDataItem[]): JsonLdNode {
  return {
    '@type': 'ItemList',
    '@id': `${pageUrl}#items`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: getAbsoluteUrl(item.path),
    })),
  };
}

function getPageNodes(options: PageNodeOptions): JsonLdNode[] {
  const pageUrl = getAbsoluteUrl(options.path);
  const pageType = options.type ?? 'WebPage';
  const isArticle = pageType === 'TechArticle';
  const articleId = `${pageUrl}#article`;
  const breadcrumbs = options.breadcrumbs ?? [{ name: 'Home', path: '/' }];
  const pageNode: JsonLdNode = {
    '@type': isArticle ? 'WebPage' : pageType,
    '@id': pageUrl,
    url: pageUrl,
    name: options.name ?? options.title,
    description: options.description,
    inLanguage: 'en',
    isPartOf: options.parentPath
      ? [{ '@id': getAbsoluteUrl(options.parentPath) }, { '@id': websiteId }]
      : { '@id': websiteId },
    about: { '@id': standardId },
    publisher: { '@id': organizationId },
    breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: ogImageUrl,
      width: 1200,
      height: 630,
    },
  };

  const nodes = [pageNode, getBreadcrumbNode(pageUrl, breadcrumbs)];

  if (options.items) {
    pageNode.mainEntity = { '@id': `${pageUrl}#items` };
    pageNode.hasPart = options.items.map((item) => ({ '@id': getAbsoluteUrl(item.path) }));
    nodes.push(getItemListNode(pageUrl, options.items));
  }

  if (isArticle) {
    pageNode.mainEntity = { '@id': articleId };
    pageNode.dateModified = options.updatedAt?.toISOString();
    nodes.push({
      '@type': 'TechArticle',
      '@id': articleId,
      url: pageUrl,
      headline: options.name ?? options.title,
      description: options.description,
      inLanguage: 'en',
      articleSection: options.articleSection,
      keywords: options.tags?.join(', '),
      dateModified: options.updatedAt?.toISOString(),
      author: options.author ? { '@type': 'Person', name: options.author } : { '@id': organizationId },
      publisher: { '@id': organizationId },
      image: ogImageUrl,
      about: { '@id': standardId },
      isPartOf: options.parentPath
        ? [{ '@id': getAbsoluteUrl(options.parentPath) }, { '@id': standardId }]
        : { '@id': standardId },
      mainEntityOfPage: { '@id': pageUrl },
    });
  }

  return nodes;
}

export function buildPageStructuredData(options: PageNodeOptions): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@graph': [getOrganizationNode(), getWebsiteNode(), getStandardNode(), ...getPageNodes(options)],
  };
}

export function buildFullStructuredData(docs: CollectionEntry<'docs'>[]): JsonLdNode {
  const graph: JsonLdNode[] = [getOrganizationNode(), getWebsiteNode(), getStandardNode()];
  const publicDocs = docs.filter((doc) => doc.data.status !== 'draft' && doc.data.status !== 'archived');

  const homeItems = docsParentCategories.map((parent) => ({
    name: parent.name,
    path: `/${parent.slug}`,
  }));
  graph.push(
    ...getPageNodes({
      path: '/',
      title: site.title,
      name: site.title,
      description: site.description,
      type: 'CollectionPage',
      breadcrumbs: [{ name: 'Home', path: '/' }],
      items: homeItems,
    }),
  );

  for (const parent of docsParentCategories) {
    const parentPath = `/${parent.slug}`;
    const categoryItems = docsCategories
      .filter((category) => category.parent === parent.slug)
      .map((category) => ({ name: category.name, path: getCategoryHref(category.slug) }));

    graph.push(
      ...getPageNodes({
        path: parentPath,
        title: `${parent.name} | ${site.name}`,
        name: parent.name,
        description: parent.description,
        type: 'CollectionPage',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: parent.name, path: parentPath },
        ],
        items: categoryItems,
        parentPath: '/',
      }),
    );
  }

  for (const category of docsCategories) {
    const parent = docsParentMap[category.parent];
    const categoryPath = getCategoryHref(category.slug);
    const categoryDocs = getOrderedDocsForCategory(publicDocs, category.slug);
    const articleItems = categoryDocs.map((doc) => ({
      name: doc.data.title,
      path: getArticleHref(category.slug, getCleanDocSlug(doc.id)),
    }));

    graph.push(
      ...getPageNodes({
        path: categoryPath,
        title: `${category.name} | ${parent.name}`,
        name: category.name,
        description: category.description,
        type: 'CollectionPage',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: parent.name, path: `/${parent.slug}` },
          { name: category.name, path: categoryPath },
        ],
        items: articleItems,
        parentPath: `/${parent.slug}`,
      }),
    );

    for (const doc of categoryDocs) {
      const articlePath = getArticleHref(doc.data.category, getCleanDocSlug(doc.id));
      graph.push(
        ...getPageNodes({
          path: articlePath,
          title: `${doc.data.title} | ${category.name}`,
          name: doc.data.title,
          description: doc.data.description ?? `${doc.data.title} documentation from ${site.name}.`,
          type: 'TechArticle',
          breadcrumbs: [
            { name: 'Home', path: '/' },
            { name: parent.name, path: `/${parent.slug}` },
            { name: category.name, path: categoryPath },
            { name: doc.data.title, path: articlePath },
          ],
          articleSection: category.name,
          author: doc.data.author,
          tags: doc.data.tags,
          updatedAt: doc.data.updatedAt,
          parentPath: categoryPath,
        }),
      );
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function serializeStructuredData(value: JsonLdNode) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

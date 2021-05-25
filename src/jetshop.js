let token = null;
let shopid = null;

export function config(t, s) {
  token = t;
  shopid = s;
}

const products = `
products {
  result {
    id
    name
    images {
      url
    }
    primaryRoute {
      path
    }
  }
}
`;

const categories = `
categories {
  result {
    id
    name
    images {
      url
    }
    primaryRoute {
      path
    }
  }
}
`;

async function jetshopFetch(query, variables) {
  return await fetch("https://storeapi.jetshop.io", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token,
      shopid,
      preview: true,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((res) => res.json());
}

let contentPages = [];

async function getContentPages() {
  const result = await jetshopFetch(`
  query {
    channel {
      url
    }
    pages {
      id
      name
      images {
        url
      }
      primaryRoute {
        path
      }
    }
  }
  `);

  if (result && result.data && result.data.pages) {
    const baseUrl = result.data.channel.url;

    return result.data.pages.map((page) => {
      const image = page.images.length > 0 ? page.images[0].url : null;

      return {
        id: `page:${page.id}`,
        title: page.name,
        image,
        url: page.primaryRoute ? `${baseUrl}${page.primaryRoute.path}` : null,
      };
    });
  }

  return [];
}

export async function search(term, contentTypes) {
  const results = [];

  if (
    contentTypes.includes("products") ||
    contentTypes.includes("categories")
  ) {
    const query = `
      query Search($term: String!) {
        channel {
          url
        }
        search(term: $term) {
          ${contentTypes.includes("products") ? products : ""}
          ${contentTypes.includes("categories") ? categories : ""}
        }
      }
    `;

    const result = await jetshopFetch(query, { term });

    if (result && result.data && result.data.search) {
      const baseUrl = result.data.channel.url;

      if (contentTypes.includes("products")) {
        result.data.search.products.result.forEach((product) => {
          const image =
            product.images.length > 0 ? product.images[0].url : null;

          results.push({
            id: `product:${product.id}`,
            title: product.name,
            image,
            url: product.primaryRoute
              ? `${baseUrl}${product.primaryRoute.path}`
              : null,
          });
        });
      }

      if (contentTypes.includes("categories")) {
        result.data.search.categories.result.forEach((category) => {
          const image =
            category.images.length > 0 ? category.images[0].url : null;

          results.push({
            id: `category:${category.id}`,
            title: category.name,
            image,
            url: category.primaryRoute
              ? `${baseUrl}${category.primaryRoute.path}`
              : null,
          });
        });
      }
    }
  }

  if (contentTypes.includes("contentPages")) {
    if (contentPages.length === 0) {
      contentPages = await getContentPages();
    }

    contentPages
      .filter(
        (page) => page.title.toLowerCase().indexOf(term.toLowerCase()) > -1
      )
      .forEach((page) => results.push(page));
  }

  return results;
}

export async function get(identifier) {
  const [type, id] = identifier.split(":");

  if (type === "product") {
    const result = await jetshopFetch(
      `
query product($id: Int!) {
  channel {
    url
  }
  product(id: $id) {
    name
    images {
      url
    }
    primaryRoute {
      path
    }
  }
}
`,
      { id }
    );

    if (result && result.data && result.data.product) {
      const baseUrl = result.data.channel.url;
      const { name, images, primaryRoute } = result.data.product;

      return {
        title: name,
        image: images.length ? images[0].url : null,
        url: primaryRoute ? `${baseUrl}${primaryRoute.path}` : null,
        type: "product",
      };
    } else {
      return null;
    }
  } else if (type === "category") {
    const result = await jetshopFetch(
      `
query category($id: Int!) {
  channel {
    url
  }
  category(id: $id) {
    name
    images {
      url
    }
    primaryRoute {
      path
    }
  }
}
`,
      { id }
    );

    if (result && result.data && result.data.category) {
      const baseUrl = result.data.channel.url;
      const { name, images, primaryRoute } = result.data.category;

      return {
        title: name,
        image: images.length ? images[0].url : null,
        url: primaryRoute ? `${baseUrl}${primaryRoute.path}` : null,
        type: "category",
      };
    } else {
      return null;
    }
  } else if (type === "page") {
    const result = await jetshopFetch(
      `
query page($id: Int!) {
  channel {
    url
  }
  page(id: $id) {
    name
    images {
      url
    }
    primaryRoute {
      path
    }
  }
}
`,
      { id }
    );

    if (result && result.data && result.data.page) {
      const baseUrl = result.data.channel.url;
      const { name, images, primaryRoute } = result.data.page;

      return {
        title: name,
        image: images.length ? images[0].url : null,
        url: primaryRoute ? `${baseUrl}${primaryRoute.path}` : null,
        type: "page",
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
}

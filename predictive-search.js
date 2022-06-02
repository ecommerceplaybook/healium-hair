$(".search-item__items").eq(0).closest(".search-item__component").hide();
$(".search-item__items").eq(1).closest(".search-item__component").hide();
$(".search-item__items").eq(2).closest(".search-item__component").hide();
$("a.search-item__search-link.w-inline-block").hide();

$(document).on(
  "click",
  "a.search-item__search-link.w-inline-block",
  function () {
    $('form[action="/search"]').submit();
  }
);
document.querySelector("input#search-input").oninput = function () {
  fetch(
    window.Shopify.routes.root +
      "search/suggest.json?q=" +
      this.value +
      "&resources[type]=product,collection,article&resources[options][unavailable_products]=hide&limit=4"
  )
    .then((response) => response.json())
    .then((suggestions) => {
      $(".search-item__items").html("");

      var products = suggestions.resources.results.products;
      var collections = suggestions.resources.results.collections;
      var articles = suggestions.resources.results.articles;
      var countP = 0,
        countA = 0,
        countC = 0;

      if (articles.length || collections.length || products.length) {
        $(
          "a.search-item__search-link.w-inline-block span.blue-text.text-weight-bold"
        ).text(this.value);
        $("a.search-item__search-link.w-inline-block").show();
      }

      if (articles.length > 0) {
        $(".search-item__items")
          .eq(2)
          .closest(".search-item__component")
          .show();
      } else {
        $(".search-item__items")
          .eq(2)
          .closest(".search-item__component")
          .hide();
      }

      if (collections.length > 0) {
        $(".search-item__items")
          .eq(1)
          .closest(".search-item__component")
          .show();
      } else {
        $(".search-item__items")
          .eq(1)
          .closest(".search-item__component")
          .hide();
      }

      if (products.length > 0) {
        $(".search-item__items")
          .eq(0)
          .closest(".search-item__component")
          .show();
      } else {
        $(".search-item__items")
          .eq(0)
          .closest(".search-item__component")
          .hide();
      }

      for (var i = 0; i < products.length; i++) {
        if (parseInt(countP) >= 4) {
          break;
        }
        var x = products[i];
        if (x.available && countP <= 4) {
          $(".search-item__items").eq(0).append(`
<a href="${x.url}" class="search-item w-inline-block">
<img src="${x.image}" loading="lazy" alt="" class="search-item__image">
<div class="search-item__link">
<div class="search-item__name">${x.title}</div>
<div class="search-item__price">$${x.price}</div>
    </div>
    </a>
`);
          countP++;
        }
      }

      for (var j = 0; j < collections.length; j++) {
        x = collections[j];
        if (countC >= 1) {
          break;
        }
        if (x.title != "All") {
          $(".search-item__items").eq(1).append(`
<a href="${x.url}" class="search-item full w-inline-block">
<img src="${x.featured_image.url}" loading="lazy" alt="" class="search-item__image">
<div class="search-item__link">
<div class="search-item__name">${x.title}</div>
<div class="search-item__price"><span class="search-item__collection-number">6</span> Products</div>
    </div>
    </a>
`);
          countC++;
        }
      }

      for (var k = 0; k < articles.length; k++) {
        if (countA >= 1) {
          break;
        }
        x = articles[k];
        $(".search-item__items").eq(2).append(`
<a href="${x.url}" class="search-item full w-inline-block">
<img src="${x.image}" loading="lazy" alt="" class="search-item__image">
<div class="search-item__link">
<div class="search-item__name">${x.title}</div>
<div class="search-item__price">Read more</div>
    </div>
    </a>
`);
        countA++;
      }

      console.log(suggestions);
    });
};

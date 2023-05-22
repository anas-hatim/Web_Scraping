const puppeteer = require('puppeteer'); // Importe le module Puppeteer pour contrôler le navigateur
const ejs = require('ejs'); // Importe le module EJS pour le rendu de templates
const fs = require('fs'); // Importe le module FS pour la manipulation de fichiers

async function scrapeAmazonMonitor() {
  const browser = await puppeteer.launch(); // Lance une instance du navigateur Chrome
  const page = await browser.newPage(); // Crée une nouvelle page dans le navigateur

  await page.goto('https://www.amazon.com/s?k=monitor'); // Accède à l'URL spécifiée

  const products = await page.evaluate(() => { // Exécute une fonction dans le contexte de la page
    const productList = []; // Initialise une liste pour stocker les produits
    const productElements = document.querySelectorAll('.s-result-item'); // Sélectionne tous les éléments correspondant à des produits

    productElements.forEach((productElement) => { // Parcourt chaque élément produit
      const nameElement = productElement.querySelector('span.a-text-normal'); // Sélectionne l'élément du nom du produit
      const priceElement = productElement.querySelector('span.a-price-whole'); // Sélectionne l'élément du prix du produit
      const linkElement = productElement.querySelector('a.a-link-normal'); // Sélectionne l'élément du lien vers le produit
      const imageElement = productElement.querySelector('img.s-image'); // Sélectionne l'élément de l'image du produit

      if (nameElement && priceElement && linkElement && imageElement) { // Vérifie si tous les éléments nécessaires sont présents
        const name = nameElement.textContent.trim(); // Récupère le nom du produit et supprime les espaces vides autour
        const price = priceElement.textContent.trim(); // Récupère le prix du produit et supprime les espaces vides autour
        const link = linkElement.href; // Récupère le lien vers le produit
        const image = imageElement.src; // Récupère l'URL de l'image du produit

        productList.push({ name, price, link, image }); // Ajoute les informations du produit à la liste
      }
    });

    return productList; // Retourne la liste des produits
  });

  const template = fs.readFileSync('template.ejs', 'utf8'); // Charge le contenu du fichier de template
  const html = ejs.render(template, { products }); // Rend le template avec les données des produits

  fs.writeFileSync('output.html', html, 'utf8'); // Écrit le contenu rendu dans un fichier de sortie

  console.log(products); // Affiche la liste des produits dans la console

  await browser.close(); // Ferme le navigateur
}

scrapeAmazonMonitor(); // Appelle la fonction pour exécuter le scraping

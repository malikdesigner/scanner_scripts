import pluralize from 'pluralize';



function toggleSingularPlural(word) {
  const pluralForm = pluralize(word, 2); // Convert to plural
  const singularForm = pluralize(word, 1); // Convert to singular

  // If the input word is in singular form, return its plural form; otherwise, return its singular form
  return word === singularForm ? pluralForm : singularForm;
}

// Test cases
const singular = "Plot";
const plural = "Plots";

console.log(toggleSingularPlural(singular)); // Should output "Cities"
console.log(toggleSingularPlural(plural));   // Should output "City"

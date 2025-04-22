#!/usr/bin/env node

// Import required modules
const readline = require("readline"); // For reading user input
const { authenticator } = require("otplib"); // For OTP generation

// Object to store secret keys with their labels
const secrets = {};

// Create interface for reading from stdin and writing to stdout
const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});

// Main menu function that displays options and handles user choice
function menu() {
   console.log("\n=== Authenticator Menu ===");
   console.log("1. Add new secret");
   console.log("2. Show current tokens");
   console.log("3. List saved entries");
   console.log("4. Exit\n");

   // Prompt user for their choice
   rl.question("Choose an option: ", (answer) => {
      switch (answer.trim()) {
         case "1":
            addSecret(); // Add new secret key
            break;
         case "2":
            showTokens(); // Generate and display current OTP tokens
            break;
         case "3":
            listSecrets(); // List all saved secret labels
            break;
         case "4":
            rl.close(); // Exit the program
            break;
         default:
            console.log("Invalid option. Try again.");
            menu(); // Show menu again on invalid input
      }
   });
}

// Function to add a new secret key with a label
function addSecret() {
   rl.question("Enter label (e.g. email/service name): ", (label) => {
      rl.question("Enter secret (base32 format): ", (secret) => {
         // Store the secret with its label
         secrets[label] = secret.trim();
         console.log(`✅ Secret for "${label}" saved.`);
         menu(); // Return to main menu
      });
   });
}

// Function to generate and display current OTP tokens for all stored secrets
function showTokens() {
   console.log("\n--- Current OTP Codes ---");
   // Iterate through all stored secrets and generate tokens
   for (const [label, secret] of Object.entries(secrets)) {
      const token = authenticator.generate(secret);
      console.log(`${label}: ${token}`);
   }
   console.log("--------------------------\n");
   menu(); // Return to main menu
}

// Function to list all stored secret labels
function listSecrets() {
   console.log("\n--- Saved Labels ---");
   // Display all labels with numbering
   Object.keys(secrets).forEach((label, i) => {
      console.log(`${i + 1}. ${label}`);
   });
   console.log("---------------------\n");
   menu(); // Return to main menu
}

// Clear console and display welcome message
console.clear();
console.log("Welcome to CLI Authenticator!");
// Start with the main menu
menu();

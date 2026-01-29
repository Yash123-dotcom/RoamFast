/**
 * RoamFast Launch Configuration
 * City-first expansion strategy
 */

export const LAUNCH_CONFIG = {
    // Primary launch city
    primaryCity: 'Goa',

    // Target number of verified properties before launch
    targetProperties: 30,

    // Current property count (update manually or via API)
    currentProperties: 25,

    // Official launch date
    launchDate: '2026-04-01',

    // Next expansion cities (in order)
    expansionCities: [
        'Dubai',
        'Bali',
        'Udaipur',
        'Barcelona',
    ],

    // Feature flags
    features: {
        showLaunchBanner: true,
        restrictToLaunchCity: false, // Set true to hide other cities
        showProgressIndicator: true,
    },
} as const;

export type LaunchCity = typeof LAUNCH_CONFIG.primaryCity | typeof LAUNCH_CONFIG.expansionCities[number];

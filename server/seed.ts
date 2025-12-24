import { db } from "./db";
import { dataBrokers, type InsertDataBroker } from "@shared/schema";

async function seed() {
  console.log("Seeding database with data brokers...");

  const brokers: InsertDataBroker[] = [
    {
      name: "Whitepages",
      url: "https://www.whitepages.com/",
      category: "people-search",
      priority: "high",
      optOutUrl: "https://www.whitepages.com/suppression-requests",
      optOutProcess: "Search for your listing → click 'Information Control' → verify via email",
      requiredInfo: ["Full Name", "Current Address", "Phone Number", "Age", "Email Address", "Previous Addresses"],
      estimatedProcessingTime: "24-48 hours",
      difficultyRating: 2,
    },
    {
      name: "Spokeo",
      url: "https://www.spokeo.com/",
      category: "people-search",
      priority: "high",
      optOutUrl: "https://www.spokeo.com/optout",
      optOutProcess: "Search for your profile → copy profile URL → submit via opt-out form → verify email",
      requiredInfo: ["Full Name", "Address History", "Phone Numbers", "Relatives", "Social Profiles"],
      estimatedProcessingTime: "7-14 days",
      difficultyRating: 3,
    },
    {
      name: "BeenVerified",
      url: "https://www.beenverified.com/",
      category: "people-search",
      priority: "high",
      optOutUrl: "https://www.beenverified.com/app/optout/search",
      optOutProcess: "Search by name + state → select record → enter email → verify link in email",
      requiredInfo: ["Full Name", "Age & DOB", "Addresses", "Phone Numbers", "Criminal Records"],
      estimatedProcessingTime: "24-48 hours",
      difficultyRating: 2,
    },
    {
      name: "Intelius",
      url: "https://www.intelius.com/",
      category: "people-search",
      priority: "medium",
      optOutUrl: "https://www.intelius.com/optout",
      optOutProcess: "Call (888) 245-1655 OR email support@mailer.intelius.com OR fill online form. May require driver's license",
      requiredInfo: ["Full Name", "Contact Info", "Address History", "Associates"],
      estimatedProcessingTime: "30-45 days",
      difficultyRating: 4,
    },
    {
      name: "MyLife",
      url: "https://www.mylife.com/",
      category: "people-search",
      priority: "high",
      optOutUrl: "https://www.mylife.com/privacy-policy",
      optOutProcess: "Call (888) 704-1900, press 2, request removal OR email privacy@mylife.com with name + profile link",
      requiredInfo: ["Full Profile", "Contact Info", "Reputation Score", "Reviews"],
      estimatedProcessingTime: "14-30 days",
      difficultyRating: 3,
    },
    {
      name: "PeopleFinders",
      url: "https://www.peoplefinders.com/",
      category: "people-search",
      priority: "high",
      optOutUrl: "https://www.peoplefinders.com/manage",
      optOutProcess: "Search → submit opt-out form → email verification",
      requiredInfo: ["Full Name", "Age", "Addresses", "Phone Numbers", "Relatives"],
      estimatedProcessingTime: "7-14 days",
      difficultyRating: 2,
    },
    {
      name: "Radaris",
      url: "https://radaris.com/",
      category: "people-search",
      priority: "medium",
      optOutUrl: "https://radaris.com/control",
      optOutProcess: "Search for profile → click 'Control Information' → verify via email",
      requiredInfo: ["Full Name", "Addresses", "Phone Numbers", "Associates", "Public Records"],
      estimatedProcessingTime: "24-72 hours",
      difficultyRating: 2,
    },
    {
      name: "PeekYou",
      url: "https://www.peekyou.com/",
      category: "people-search",
      priority: "medium",
      optOutUrl: "https://www.peekyou.com/about/contact/ccpa_optout/do_not_sell/",
      optOutProcess: "Search → submit name + state → opt-out form → email verification",
      requiredInfo: ["Full Name", "Social Media Profiles", "Photos", "Contact Info"],
      estimatedProcessingTime: "7-14 days",
      difficultyRating: 2,
    },
    {
      name: "ThatsThem",
      url: "https://thatsthem.com/",
      category: "people-search",
      priority: "medium",
      optOutUrl: "https://thatsthem.com/optout",
      optOutProcess: "Search → submit profile URL → email verification",
      requiredInfo: ["Full Name", "Phone Numbers", "Addresses", "Email Addresses"],
      estimatedProcessingTime: "24-48 hours",
      difficultyRating: 2,
    },
    {
      name: "USPhonebook",
      url: "https://www.usphonebook.com/",
      category: "people-search",
      priority: "low",
      optOutUrl: "https://www.usphonebook.com/",
      optOutProcess: "Search and opt-out on same page",
      requiredInfo: ["Name", "Phone Number", "Address"],
      estimatedProcessingTime: "24 hours",
      difficultyRating: 1,
    },
    {
      name: "Acxiom",
      url: "https://www.acxiom.com/",
      category: "marketing",
      priority: "medium",
      optOutUrl: "https://isapps.acxiom.com/optout/optout.aspx",
      optOutProcess: "Scroll to footer → 'Do Not Sell My Personal Information' → complete opt-out form",
      requiredInfo: ["Name", "Address", "Email", "Phone"],
      estimatedProcessingTime: "30 days",
      difficultyRating: 2,
    },
    {
      name: "Epsilon",
      url: "https://www.epsilon.com/",
      category: "marketing",
      priority: "medium",
      optOutUrl: "https://www.epsilon.com/us/privacy-policy",
      optOutProcess: "Contact via privacy form",
      requiredInfo: ["Name", "Address", "Email"],
      estimatedProcessingTime: "30 days",
      difficultyRating: 3,
    },
    {
      name: "LiveRamp",
      url: "https://liveramp.com/",
      category: "marketing",
      priority: "medium",
      optOutUrl: "https://liveramp.com/privacy/my-privacy-choices/",
      optOutProcess: "Submit privacy request",
      requiredInfo: ["Email", "Name"],
      estimatedProcessingTime: "30 days",
      difficultyRating: 2,
    },
    {
      name: "Experian",
      url: "https://www.experian.com/",
      category: "credit",
      priority: "high",
      optOutUrl: "https://consumerprivacy.experian.com/",
      optOutProcess: "Submit request via consumer privacy portal",
      requiredInfo: ["Name", "Address", "SSN", "DOB"],
      estimatedProcessingTime: "30 days",
      difficultyRating: 3,
    },
    {
      name: "Equifax",
      url: "https://www.equifax.com/",
      category: "credit",
      priority: "high",
      optOutUrl: "https://www.equifax.com/personal/",
      optOutProcess: "Opt-out from pre-approved credit offers + targeted marketing",
      requiredInfo: ["Name", "Address", "SSN", "DOB"],
      estimatedProcessingTime: "30 days",
      difficultyRating: 3,
    },
    {
      name: "TransUnion",
      url: "https://www.transunion.com/",
      category: "credit",
      priority: "high",
      optOutUrl: "https://www.transunion.com/privacy",
      optOutProcess: "Submit privacy request",
      requiredInfo: ["Name", "Address", "SSN", "DOB"],
      estimatedProcessingTime: "30 days",
      difficultyRating: 3,
    },
    {
      name: "CheckPeople",
      url: "https://www.checkpeople.com/",
      category: "people-search",
      priority: "medium",
      optOutUrl: "https://www.checkpeople.com/optout",
      optOutProcess: "Submit opt-out form with personal information",
      requiredInfo: ["Full Name", "Age", "State"],
      estimatedProcessingTime: "7-14 days",
      difficultyRating: 2,
    },
    {
      name: "Nuwber",
      url: "https://nuwber.com/",
      category: "people-search",
      priority: "medium",
      optOutUrl: "https://nuwber.com/removal/link",
      optOutProcess: "Submit removal request form",
      requiredInfo: ["Full Name", "Phone Number", "Address"],
      estimatedProcessingTime: "24-72 hours",
      difficultyRating: 2,
    },
    {
      name: "FastPeopleSearch",
      url: "https://www.fastpeoplesearch.com/",
      category: "people-search",
      priority: "medium",
      optOutUrl: "https://www.fastpeoplesearch.com/removal",
      optOutProcess: "Search for record → submit removal request",
      requiredInfo: ["Full Name", "Current Address", "Age"],
      estimatedProcessingTime: "24-48 hours",
      difficultyRating: 2,
    },
    {
      name: "FamilyTreeNow",
      url: "https://www.familytreenow.com/",
      category: "people-search",
      priority: "medium",
      optOutUrl: "https://www.familytreenow.com/optout",
      optOutProcess: "Search for record → submit opt-out request",
      requiredInfo: ["Full Name", "Age", "State", "Family Members"],
      estimatedProcessingTime: "24-72 hours",
      difficultyRating: 2,
    },
  ];

  try {
    // Check if we already have brokers
    const existing = await db.select().from(dataBrokers);
    if (existing.length > 0) {
      console.log(`Database already seeded with ${existing.length} brokers. Skipping.`);
      return;
    }

    // Insert all brokers
    await db.insert(dataBrokers).values(brokers);
    console.log(`✅ Successfully seeded ${brokers.length} data brokers`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("Seed complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });

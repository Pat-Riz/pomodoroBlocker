let blockedSites: string[] = ["reddit.com", "facebook.com", "twitter.com"];

export async function updateBlockedSites(newBlockedSites: string[]) {
  blockedSites = newBlockedSites;

  const newRules = newBlockedSites.map((website, index) => {
    return {
      id: index + 1, // Rule ID must be >= 1
      priority: 1,
      action: {
        type: "redirect" as chrome.declarativeNetRequest.RuleActionType,
        redirect: {
          url: "https://pomodorolandingpage.vercel.app/shame",
        },
      },
      condition: {
        urlFilter: `||${website}`,
        resourceTypes: [
          "main_frame",
          "sub_frame",
        ] as chrome.declarativeNetRequest.ResourceType[],
      },
    };
  });
  updateRules(newRules);
}

export async function updateRules(
  newRules?: chrome.declarativeNetRequest.Rule[]
) {
  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  const idsToDelete = oldRules.map((rule) => {
    return rule.id;
  });
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: newRules,
    removeRuleIds: idsToDelete,
  });
}

export function getBlockedSites(): string[] {
  return blockedSites;
}

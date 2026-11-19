import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

async function main() {
  const outputDir = path.resolve("public/videos");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Launching Chromium for video recording...");
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1366, height: 768 },
    },
  });

  const page = await context.newPage();

  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // 1. Showcase Top Bar & Welcome Modal
  console.log("1. Checking Welcome Guide modal...");
  await page.waitForTimeout(1500);

  const startDemoBtn = page.locator('button:has-text("Start the 2-minute demo")').first();
  if (await startDemoBtn.isVisible()) {
    console.log(" - Welcome Modal is open. Showcasing the 3 core parts...");
    await page.waitForTimeout(3000);
    console.log(" - Clicking 'Start the 2-minute demo'...");
    await startDemoBtn.click();
    await page.waitForTimeout(1500);
  } else {
    // If not open, click Guide button
    const guideBtn = page.locator('button:has-text("Guide")').first();
    if (await guideBtn.isVisible()) {
      await guideBtn.click();
      await page.waitForTimeout(2500);
      const btn = page.locator('button:has-text("Start the 2-minute demo")').first();
      if (await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(1500);
      }
    }
  }

  // 3. Showcase 4-Step Stepper & Sample Draft Selector
  console.log("3. Inspecting 4-Step Stepper...");
  await page.waitForTimeout(2000);

  // 4. Click Check My Script for Mistakes (Step 1)
  console.log("4. Clicking 'Check My Script for Mistakes' (Step 1)...");
  const checkBtn = page.locator('button:has-text("Check My Script for Mistakes")').first();
  if (await checkBtn.isVisible()) {
    await checkBtn.click();
    await page.waitForTimeout(3000);
  }

  // 5. Expand Finding and Accept Fix (Step 2)
  console.log("5. Expanding finding for 'cheap'...");
  const cheapFinding = page.locator('button:has-text("cheap")').first();
  if (await cheapFinding.isVisible()) {
    await cheapFinding.click();
    await page.waitForTimeout(2000);

    // Click Accept Proposed Fix
    const acceptFixBtn = page.locator('button:has-text("Accept Proposed Fix"), button:has-text("Accept 1-Click Fix")').first();
    if (await acceptFixBtn.isVisible()) {
      console.log(" - Accepting proposed fix ('cheap' -> 'cost-effective')...");
      await acceptFixBtn.click();
      await page.waitForTimeout(2000);
    }
  }

  // Expand finding for 'miracle'
  console.log(" - Expanding finding for 'miracle'...");
  const miracleFinding = page.locator('button:has-text("miracle")').first();
  if (await miracleFinding.isVisible()) {
    await miracleFinding.click();
    await page.waitForTimeout(2000);

    const acceptMiracleBtn = page.locator('button:has-text("Accept Proposed Fix"), button:has-text("Accept 1-Click Fix")').first();
    if (await acceptMiracleBtn.isVisible()) {
      console.log(" - Accepting proposed fix ('miracle' -> 'scientifically backed')...");
      await acceptMiracleBtn.click();
      await page.waitForTimeout(2000);
    }
  }

  // Inspect Sensitive Hold Finding
  console.log(" - Inspecting sensitive claim ('cure chronic fatigue')...");
  const sensitiveFinding = page.locator('button:has-text("cure")').first();
  if (await sensitiveFinding.isVisible()) {
    await sensitiveFinding.click();
    await page.waitForTimeout(2500);
  }

  // 6. Test Document Upload Tab
  console.log("6. Testing Document Upload Tab...");
  const uploadTab = page.locator('button:has-text("Upload Document")').first();
  if (await uploadTab.isVisible()) {
    await uploadTab.click();
    await page.waitForTimeout(2000);

    // Test file input with sample PDF
    const samplePdfPath = path.resolve("public/sample-marketing-pitch.pdf");
    if (fs.existsSync(samplePdfPath)) {
      console.log(" - Uploading sample-marketing-pitch.pdf...");
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(samplePdfPath);
      await page.waitForTimeout(3000);
    }
  }

  // Return to Write/Paste tab
  const writeTab = page.locator('button:has-text("Write or Paste")').first();
  if (await writeTab.isVisible()) {
    await writeTab.click();
    await page.waitForTimeout(1500);
  }

  // 7. Navigate via Sidebar to Review Queue (/review) (Step 3)
  console.log("7. Navigating via Sidebar to Review Queue (/review)...");
  await page.click('aside a:has-text("Review Queue"), a:has-text("Review Queue")');
  await page.waitForURL("**/review", { timeout: 10000 });
  await page.waitForTimeout(2500);

  // If Creator lockout is shown, switch role
  const switchReviewerBtn = page.locator('button:has-text("Switch to Ananya (Reviewer)")').first();
  if (await switchReviewerBtn.isVisible()) {
    await switchReviewerBtn.click();
    await page.waitForTimeout(2000);
  }

  // Select first pending submission in Review Queue
  console.log(" - Opening submission details in Review Queue...");
  const pendingSub = page.locator('button:has-text("Q3 Vitality Blend")').first();
  if (await pendingSub.isVisible()) {
    await pendingSub.click();
    await page.waitForTimeout(2000);

    // Add a comment
    console.log(" - Posting reviewer note in submission thread...");
    const commentBox = page.locator('input[placeholder*="comment"], input[placeholder*="note"]').first();
    if (await commentBox.isVisible()) {
      await commentBox.fill("Reviewer verified: clinical documentation on file. Approved for publishing.");
      await page.locator('button:has-text("Post")').first().click();
      await page.waitForTimeout(2000);
    }

    // Click Approve Submission
    console.log(" - Granting legal approval with mandatory justification...");
    const approveBtn = page.locator('button:has-text("Approve Submission")').first();
    if (await approveBtn.isVisible()) {
      await approveBtn.click();
      await page.waitForTimeout(1500);

      const reasonBox = page.locator('textarea[placeholder*="regulatory"], textarea[placeholder*="justification"]').first();
      if (await reasonBox.isVisible()) {
        await reasonBox.fill("Approved: verified against corporate health claim safe harbor guidelines.");
        await page.waitForTimeout(1000);
        await page.locator('button:has-text("Confirm & Log Decision"), button:has-text("Confirm")').first().click();
        await page.waitForTimeout(2500);
      }
    }
  }

  // 8. Navigate via Sidebar to History (/history) (Step 4)
  console.log("8. Navigating via Sidebar to History (/history)...");
  await page.click('aside a:has-text("History"), a:has-text("History")');
  await page.waitForURL("**/history", { timeout: 10000 });
  await page.waitForTimeout(2500);

  // Filter by Approved
  console.log(" - Filtering History by 'Approved'...");
  const approvedFilter = page.locator('button:has-text("Approved")').first();
  if (await approvedFilter.isVisible()) {
    await approvedFilter.click();
    await page.waitForTimeout(2000);
  }

  // Filter by Accepted Fix
  console.log(" - Filtering History by 'Accepted Fix'...");
  const fixFilter = page.locator('button:has-text("Accepted Fix")').first();
  if (await fixFilter.isVisible()) {
    await fixFilter.click();
    await page.waitForTimeout(2000);
  }

  // 9. Navigate via Sidebar to Insights (/insights) (Step 4)
  console.log("9. Navigating via Sidebar to Insights (/insights)...");
  await page.click('aside a:has-text("Insights"), a:has-text("Insights")');
  await page.waitForURL("**/insights", { timeout: 10000 });
  await page.waitForTimeout(2500);

  // 10. Navigate via Sidebar to Brand Rules (/guidelines)
  console.log("10. Navigating via Sidebar to Brand Rules (/guidelines)...");
  await page.click('aside a:has-text("Brand Rules"), a:has-text("Brand Rules")');
  await page.waitForURL("**/guidelines", { timeout: 10000 });
  await page.waitForTimeout(2500);

  // Return to Studio
  console.log("11. Returning to Studio...");
  await page.click('aside a:has-text("Studio"), a:has-text("Studio")');
  await page.waitForURL("**/", { timeout: 10000 });
  await page.waitForTimeout(3000);

  console.log("Closing browser and saving recording...");
  await context.close();
  await browser.close();

  // Find the generated webm video
  const files = fs.readdirSync(outputDir).filter((f) => f.endsWith(".webm"));
  if (files.length > 0) {
    // Sort by latest mtime
    const sorted = files.map((f) => ({
      name: f,
      time: fs.statSync(path.join(outputDir, f)).mtime.getTime(),
    })).sort((a, b) => b.time - a.time);

    const latestWebm = path.join(outputDir, sorted[0].name);
    const finalMp4 = path.join(outputDir, "verity-full-product-walkthrough.mp4");
    const artifactMp4 = path.resolve(
      "C:\\Users\\Shiva\\.gemini\\antigravity\\brain\\1c36aadb-6651-457e-a85f-9e1c1fdca50a",
      "verity-full-product-walkthrough.mp4"
    );

    console.log(`Converting ${latestWebm} to MP4 using FFmpeg...`);
    const ffmpegPath = "D:\\bin\\ffmpeg.exe";

    try {
      execSync(`"${ffmpegPath}" -y -i "${latestWebm}" -c:v libx264 -pix_fmt yuv420p -crf 22 -preset medium "${finalMp4}"`, {
        stdio: "inherit",
      });
      console.log(`MP4 successfully saved at: ${finalMp4}`);

      // Copy to artifact directory
      fs.copyFileSync(finalMp4, artifactMp4);
      console.log(`MP4 successfully copied to artifact: ${artifactMp4}`);
    } catch (e: any) {
      console.error("FFmpeg conversion failed:", e.message);
    }
  }

  console.log("Walkthrough recording complete!");
}

main().catch((err) => {
  console.error("Error running walkthrough recording:", err);
  process.exit(1);
});

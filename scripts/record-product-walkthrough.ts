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

  // 1. Showcase Hero & New Copy
  console.log("1. Showcasing Hero...");
  await page.waitForTimeout(2000);

  // 2. Open 2-Minute Guided Demo (Slides 1 to 5)
  console.log("2. Opening 2-minute Guided Demo presentation...");
  const demoBtn = page.locator('button:has-text("2-minute guided demo")').first();
  if (await demoBtn.isVisible()) {
    await demoBtn.click();
    await page.waitForTimeout(2500);

    // Slide 2
    console.log(" - Advancing to Slide 2...");
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(2500);

    // Slide 3
    console.log(" - Advancing to Slide 3...");
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(2500);

    // Slide 4
    console.log(" - Advancing to Slide 4...");
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(2500);

    // Slide 5
    console.log(" - Advancing to Slide 5...");
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(3000);

    // Close Modal
    console.log(" - Closing Guided Demo...");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1500);
  }

  // 3. Showcase 4-Step "Start Here" Guide
  console.log("3. Scrolling to 4-Step Start Here Panel...");
  await page.evaluate(() => {
    window.scrollBy({ top: 380, behavior: "smooth" });
  });
  await page.waitForTimeout(2500);

  // 4. Showcase Studio & Check Script for Mistakes
  console.log("4. Scrolling to Studio...");
  await page.evaluate(() => {
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  });
  await page.waitForTimeout(2000);

  // Click Check My Script
  console.log(" - Clicking 'Check My Script for Mistakes'...");
  const checkBtn = page.locator('button:has-text("Check My Script for Mistakes")').first();
  if (await checkBtn.isVisible()) {
    await checkBtn.click();
    await page.waitForTimeout(3000);
  }

  // 5. Expand and Accept 1-Click Fixes
  console.log("5. Expanding finding for 'cheap'...");
  const cheapFinding = page.locator('button:has-text("cheap")').first();
  if (await cheapFinding.isVisible()) {
    await cheapFinding.click();
    await page.waitForTimeout(2000);

    // Click Accept 1-Click Fix
    const acceptFixBtn = page.locator('button:has-text("Accept 1-Click Fix")').first();
    if (await acceptFixBtn.isVisible() && await acceptFixBtn.isEnabled()) {
      console.log(" - Accepting 1-click replacement ('cheap' -> 'cost-effective')...");
      await acceptFixBtn.click();
      await page.waitForTimeout(2500);
    }
  }

  // Expand finding for 'miracle'
  console.log(" - Expanding finding for 'miracle'...");
  const miracleFinding = page.locator('button:has-text("miracle")').first();
  if (await miracleFinding.isVisible()) {
    await miracleFinding.click();
    await page.waitForTimeout(2000);

    const acceptMiracleBtn = page.locator('button:has-text("Accept 1-Click Fix")').first();
    if (await acceptMiracleBtn.isVisible() && await acceptMiracleBtn.isEnabled()) {
      console.log(" - Accepting 1-click replacement ('miracle' -> 'scientifically backed')...");
      await acceptMiracleBtn.click();
      await page.waitForTimeout(2500);
    }
  }

  // Expand sensitive claim
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

  // Return to Editor tab
  const editorTab = page.locator('button:has-text("Script Editor")').first();
  if (await editorTab.isVisible()) {
    await editorTab.click();
    await page.waitForTimeout(1500);
  }

  // 7. Navigate to Review Queue (/review)
  console.log("7. Navigating to Review Queue (/review)...");
  await page.click('nav a:has-text("Review Queue")');
  await page.waitForURL("**/review", { timeout: 10000 });
  await page.waitForTimeout(2500);

  // Switch to Ananya (Reviewer) if on creator
  const roleBtn = page.locator('button:has-text("Switch Active Role"), button:has-text("Rahul"), button:has-text("Ananya")').first();
  console.log(" - Opening submission details in Review Queue...");
  const pendingSub = page.locator('button:has-text("Q3 Vitality Blend")').first();
  if (await pendingSub.isVisible()) {
    await pendingSub.click();
    await page.waitForTimeout(2500);

    // Scroll down to review findings and comments
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: "smooth" }));
    await page.waitForTimeout(2000);

    // Add a comment
    console.log(" - Posting reviewer note in submission thread...");
    const commentBox = page.locator('input[placeholder*="Add note"]');
    if (await commentBox.isVisible()) {
      await commentBox.fill("Reviewer verified: clinical documentation on file. Approved for publishing.");
      await page.locator('button:has-text("Post Note")').click();
      await page.waitForTimeout(2000);
    }

    // Click Approve
    console.log(" - Granting legal approval with mandatory justification...");
    const approveBtn = page.locator('button:has-text("Approve")').first();
    if (await approveBtn.isVisible()) {
      await approveBtn.click();
      await page.waitForTimeout(1500);

      const reasonBox = page.locator('textarea[placeholder*="Enter justification"]');
      if (await reasonBox.isVisible()) {
        await reasonBox.fill("Approved: verified against SEC and FTC health claim safe harbor guidelines.");
        await page.waitForTimeout(1000);
        await page.locator('button:has-text("Confirm Approval")').click();
        await page.waitForTimeout(2500);
      }
    }
  }

  // 8. Navigate to Immutable History (/history)
  console.log("8. Navigating to Immutable History (/history)...");
  await page.click('nav a:has-text("History")');
  await page.waitForURL("**/history", { timeout: 10000 });
  await page.waitForTimeout(3000);

  // Filter actions
  console.log(" - Filtering by 'Approved'...");
  const approvedFilter = page.locator('button:has-text("Approved")').first();
  if (await approvedFilter.isVisible()) {
    await approvedFilter.click();
    await page.waitForTimeout(2000);
  }

  console.log(" - Filtering by 'Accepted Fix'...");
  const fixFilter = page.locator('button:has-text("Accepted Fix")').first();
  if (await fixFilter.isVisible()) {
    await fixFilter.click();
    await page.waitForTimeout(2000);
  }

  const allFilter = page.locator('button:has-text("All Actions")').first();
  if (await allFilter.isVisible()) {
    await allFilter.click();
    await page.waitForTimeout(2000);
  }

  // 9. Navigate to Clarity Insights (/insights)
  console.log("9. Navigating to Guideline Clarity Analytics (/insights)...");
  await page.click('nav a:has-text("Insights")');
  await page.waitForURL("**/insights", { timeout: 10000 });
  await page.waitForTimeout(3000);

  // Scroll down heatmap table
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: "smooth" }));
  await page.waitForTimeout(3000);

  // 10. Return to Home
  console.log("10. Returning to Home...");
  await page.click('a:has-text("Back to Studio")');
  await page.waitForURL("http://localhost:3000/**", { timeout: 10000 });
  await page.waitForTimeout(3000);

  // Close context to finish video
  console.log("Closing browser and finalizing video recording...");
  await page.close();
  await context.close();
  await browser.close();

  // Find the generated video file
  const videoFiles = fs.readdirSync(outputDir).filter(f => f.endsWith(".webm"));
  if (videoFiles.length > 0) {
    const latestWebm = path.join(outputDir, videoFiles[videoFiles.length - 1]);
    const finalMp4 = path.join(outputDir, "verity-full-product-walkthrough.mp4");
    console.log(`Converting ${latestWebm} to ${finalMp4} using ffmpeg...`);
    try {
      execSync(`ffmpeg -y -i "${latestWebm}" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 22 "${finalMp4}"`, { stdio: "inherit" });
      console.log(`Video recording ready at: ${finalMp4}`);
    } catch (e) {
      console.warn("FFmpeg conversion fallback:", e);
    }
  }

  console.log("Video recording successfully completed!");
}

main().catch((err) => {
  console.error("Recording error:", err);
  process.exit(1);
});

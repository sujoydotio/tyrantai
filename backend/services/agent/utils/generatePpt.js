import pptxgen from "pptxgenjs";

const COLORS = {
  navy: "14213D",
  primary: "3563E9",
  accent: "6C8FFF",
  text: "263449",
  muted: "718096",
  white: "FFFFFF",
  background: "F7F9FC",
  border: "E6EAF1",
  lightBlue: "EEF3FF",
  pale: "F1F5F9",
};

const WIDTH = 13.333;
const HEIGHT = 7.5;

const FONT = "Aptos";

export const generatePpt = async (data) => {
  const ppt = new pptxgen();

  ppt.layout = "LAYOUT_WIDE";
  ppt.author = "TyrantAI";
  ppt.title = data?.title || "Untitled Presentation";
  ppt.subject = data?.title || "Presentation";
  ppt.company = "TyrantAI";
  ppt.lang = "en-US";

  ppt.theme = {
    headFontFace: FONT,
    bodyFontFace: FONT,
    lang: "en-US",
  };

  // Professional presentation properties
  ppt.defineSlideMaster({
    title: "CONTENT_MASTER",
    background: { color: COLORS.white },
    objects: [
      {
        rect: {
          x: 0,
          y: 0,
          w: WIDTH,
          h: 0.07,
          line: { color: COLORS.primary, transparency: 100 },
          fill: { color: COLORS.primary },
        },
      },
    ],
    slideNumber: {
      x: 12.1,
      y: 7.12,
      w: 0.6,
      h: 0.18,
      color: COLORS.muted,
      fontFace: FONT,
      fontSize: 9,
      align: "right",
    },
  });

  const slides = Array.isArray(data?.slides) ? data.slides : [];

  // Split large content into multiple slides.
  const expandedSlides = [];

  slides.forEach((slide) => {
    const points = Array.isArray(slide.points) ? slide.points : [];
    const chunks = [];

    for (let i = 0; i < points.length; i += 5) {
      chunks.push(points.slice(i, i + 5));
    }

    if (chunks.length === 0) {
      chunks.push([]);
    }

    chunks.forEach((chunk, index) => {
      expandedSlides.push({
        title:
          chunks.length > 1
            ? `${slide.title || "Untitled"}${index > 0 ? ` (Continued ${index + 1})` : ""}`
            : slide.title || "Untitled",
        points: chunk,
      });
    });
  });

  const totalSlides = expandedSlides.length;

  addCover(ppt, data);

  expandedSlides.forEach((slide, index) => {
    addContentSlide(ppt, slide.title, slide.points, index + 1, totalSlides);
  });

  addThankYou(ppt);

  return ppt;
};

// --------------------------------------------------
// COVER SLIDE
// --------------------------------------------------

const addCover = (ppt, data) => {
  const slide = ppt.addSlide();

  slide.background = {
    color: COLORS.navy,
  };

  // Decorative accent shape
  slide.addShape(ppt.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.16,
    h: HEIGHT,
    line: { color: COLORS.primary, transparency: 100 },
    fill: { color: COLORS.primary },
  });

  // Decorative circles
  slide.addShape(ppt.ShapeType.ellipse, {
    x: 9.6,
    y: -1.5,
    w: 5,
    h: 5,
    line: { color: COLORS.accent, transparency: 100 },
    fill: {
      color: COLORS.accent,
      transparency: 88,
    },
  });

  slide.addShape(ppt.ShapeType.ellipse, {
    x: 10.7,
    y: 4.5,
    w: 3.5,
    h: 3.5,
    line: { color: COLORS.primary, transparency: 100 },
    fill: {
      color: COLORS.primary,
      transparency: 82,
    },
  });

  // Brand label
  slide.addText("TYRANTAI  /  PRESENTATION", {
    x: 0.85,
    y: 0.85,
    w: 5,
    h: 0.3,
    fontFace: FONT,
    fontSize: 11,
    bold: true,
    charSpacing: 2,
    color: "A9BCFF",
  });

  // Accent line
  slide.addShape(ppt.ShapeType.rect, {
    x: 0.88,
    y: 2.05,
    w: 0.75,
    h: 0.06,
    line: { color: COLORS.accent, transparency: 100 },
    fill: { color: COLORS.accent },
  });

  // Main title
  slide.addText(data?.title || "Untitled Presentation", {
    x: 0.85,
    y: 2.35,
    w: 10.8,
    h: 1.45,
    fontFace: FONT,
    fontSize: 34,
    bold: true,
    color: COLORS.white,
    breakLine: false,
    valign: "mid",
    fit: "shrink",
    margin: 0,
  });

  // Subtitle
  if (data?.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.9,
      y: 4.05,
      w: 9.2,
      h: 0.8,
      fontFace: FONT,
      fontSize: 17,
      color: "C5D1E8",
      breakLine: false,
      valign: "top",
      fit: "shrink",
      margin: 0,
    });
  }

  // Bottom branding
  slide.addShape(ppt.ShapeType.line, {
    x: 0.9,
    y: 6.55,
    w: 11.5,
    h: 0,
    line: {
      color: "35435F",
      transparency: 15,
      width: 1,
    },
  });

  slide.addText("Generated with TyrantAI", {
    x: 0.9,
    y: 6.78,
    w: 4,
    h: 0.25,
    fontFace: FONT,
    fontSize: 10,
    color: "A9B5CC",
  });

  slide.addText("IDEAS INTO PRESENTATIONS", {
    x: 8.5,
    y: 6.78,
    w: 3.9,
    h: 0.25,
    fontFace: FONT,
    fontSize: 9,
    charSpacing: 1.5,
    color: "A9B5CC",
    align: "right",
  });
};

// --------------------------------------------------
// CONTENT SLIDE
// --------------------------------------------------

function addContentSlide(ppt, title, points, page, total) {
  const slide = ppt.addSlide("CONTENT_MASTER");

  slide.background = {
    color: COLORS.white,
  };

  // Section label
  slide.addText("KEY INFORMATION", {
    x: 0.8,
    y: 0.55,
    w: 4,
    h: 0.2,
    fontFace: FONT,
    fontSize: 9,
    bold: true,
    charSpacing: 1.8,
    color: COLORS.primary,
  });

  // Slide title
  slide.addText(title, {
    x: 0.8,
    y: 0.95,
    w: 11.8,
    h: 0.65,
    fontFace: FONT,
    fontSize: 25,
    bold: true,
    color: COLORS.navy,
    fit: "shrink",
    margin: 0,
    valign: "mid",
  });

  // Title divider
  slide.addShape(ppt.ShapeType.line, {
    x: 0.8,
    y: 1.75,
    w: 11.7,
    h: 0,
    line: {
      color: COLORS.border,
      width: 1.2,
    },
  });

  const visiblePoints = Array.isArray(points) ? points : [];

  const startY = 2.05;
  const rowHeight = 0.88;
  const gap = 0.12;

  visiblePoints.forEach((point, index) => {
    const y = startY + index * (rowHeight + gap);
    const pointText = typeof point === "string" ? point : JSON.stringify(point);

    // Light background row
    slide.addShape(ppt.ShapeType.roundRect, {
      x: 0.8,
      y,
      w: 11.7,
      h: rowHeight,
      rectRadius: 0.08,
      line: {
        color: COLORS.border,
        transparency: 35,
        width: 0.7,
      },
      fill: {
        color: index % 2 === 0 ? COLORS.background : COLORS.white,
      },
    });

    // Number indicator
    slide.addShape(ppt.ShapeType.ellipse, {
      x: 1.05,
      y: y + 0.25,
      w: 0.36,
      h: 0.36,
      line: {
        color: COLORS.lightBlue,
        transparency: 100,
      },
      fill: {
        color: COLORS.lightBlue,
      },
    });

    slide.addText(String(index + 1).padStart(2, "0"), {
      x: 1.05,
      y: y + 0.32,
      w: 0.36,
      h: 0.15,
      fontFace: FONT,
      fontSize: 8,
      bold: true,
      color: COLORS.primary,
      align: "center",
      margin: 0,
    });

    // Point content
    slide.addText(pointText, {
      x: 1.65,
      y: y + 0.12,
      w: 10.45,
      h: 0.62,
      fontFace: FONT,
      fontSize: 15,
      color: COLORS.text,
      valign: "mid",
      breakLine: false,
      fit: "shrink",
      margin: 0,
      paraSpaceAfterPt: 0,
    });
  });

  // Footer divider
  slide.addShape(ppt.ShapeType.line, {
    x: 0.8,
    y: 6.85,
    w: 11.7,
    h: 0,
    line: {
      color: COLORS.border,
      width: 0.8,
    },
  });

  slide.addText("TYRANTAI", {
    x: 0.8,
    y: 7.02,
    w: 2,
    h: 0.18,
    fontFace: FONT,
    fontSize: 9,
    bold: true,
    charSpacing: 1,
    color: COLORS.muted,
    margin: 0,
  });

  slide.addText(`PAGE ${page} OF ${total}`, {
    x: 10.5,
    y: 7.02,
    w: 2,
    h: 0.18,
    fontFace: FONT,
    fontSize: 9,
    color: COLORS.muted,
    align: "right",
    margin: 0,
  });
}

// --------------------------------------------------
// THANK YOU SLIDE
// --------------------------------------------------

const addThankYou = (ppt) => {
  const slide = ppt.addSlide();

  slide.background = {
    color: COLORS.navy,
  };

  // Accent line
  slide.addShape(ppt.ShapeType.rect, {
    x: 6.15,
    y: 2.15,
    w: 1,
    h: 0.06,
    line: { color: COLORS.accent, transparency: 100 },
    fill: { color: COLORS.accent },
  });

  slide.addText("Thank You", {
    x: 1,
    y: 2.65,
    w: 11.3,
    h: 0.9,
    fontFace: FONT,
    fontSize: 38,
    bold: true,
    color: COLORS.white,
    align: "center",
    margin: 0,
  });

  slide.addText("Questions  •  Thoughts  •  Discussion", {
    x: 1,
    y: 3.8,
    w: 11.3,
    h: 0.35,
    fontFace: FONT,
    fontSize: 15,
    color: "B8C7E5",
    align: "center",
    margin: 0,
  });

  slide.addShape(ppt.ShapeType.line, {
    x: 0.9,
    y: 6.55,
    w: 11.5,
    h: 0,
    line: {
      color: "35435F",
      transparency: 15,
      width: 1,
    },
  });

  slide.addText("Generated with TyrantAI", {
    x: 0,
    y: 6.85,
    w: WIDTH,
    h: 0.25,
    fontFace: FONT,
    fontSize: 10,
    color: "A9B5CC",
    align: "center",
    margin: 0,
  });
};

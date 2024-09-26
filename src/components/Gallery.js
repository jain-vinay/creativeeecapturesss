import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { FaArrowLeft, FaArrowDown } from "react-icons/fa"; // Importing icons from react-icons
import "./Gallery.css";

const Gallery = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [initialPositions, setInitialPositions] = useState([]); // Store initial positions

  useEffect(() => {
    const items = document.querySelectorAll(".item");
    const container = document.querySelector(".gallery");
    const numberOfItems = items.length;
    const radius = 300; // Radius of the circle
    const angleIncrement = (2 * Math.PI) / numberOfItems; // Angle increment for each item

    // Center of the gallery
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;

    const positions = []; // Array to store initial positions

    // GSAP timeline for animations
    const t1 = gsap.timeline({ delay: 0.5 }); // Adding delay before animation starts

    items.forEach((item, index) => {
      const angle = index * angleIncrement;
      const x = centerX + radius * Math.cos(angle) - item.offsetWidth / 2;
      const y = centerY + radius * Math.sin(angle) - item.offsetHeight / 2;

      // Store initial positions
      positions.push({ x, y });

      // Set the position of each item in a circular path
      gsap.set(item, {
        x: x,
        y: y,
        transformOrigin: "center center",
        rotation: angle * (180 / Math.PI) + 90, // Correct rotation to face outward
        scale: 0, // Start with scale 0 for the loading animation
      });

      // Animate the gallery items appearing in a circle with a trail effect
      t1.to(
        item,
        {
          scale: 1,
          duration: 1,
          ease: "power2.out",
        },
        index * 0.1 // Trail effect by using staggered delay
      );

      // Add event listener to enlarge image on click
      item.addEventListener("click", function () {
        if (!isGalleryOpen) {
          setActiveImage(item); // Set active image
          setIsGalleryOpen(true);

          // Zoom the clicked image to the center
          gsap.to(item, {
            x: centerX - item.offsetWidth / 2,
            y: centerY - item.offsetHeight / 2,
            scale: 5, // Zoom in effect
            rotation: 0,
            duration: 1,
            ease: "power2.inOut",
          });

          // Hide other images
          gsap.to(Array.from(items).filter((i) => i !== item), {
            scale: 0,
            duration: 0.5,
            ease: "power2.in",
          });
        }
      });
    });

    setInitialPositions(positions); // Save initial positions to state
  }, [isGalleryOpen]);

  // Close the gallery
  const closeGallery = () => {
    const items = document.querySelectorAll(".item");

    // Animate the active image going back to its original place
    gsap.to(activeImage, {
      x: initialPositions[Array.from(items).indexOf(activeImage)].x,
      y: initialPositions[Array.from(items).indexOf(activeImage)].y,
      scale: 1,
      rotation: gsap.getProperty(activeImage, "rotation"),
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        setIsGalleryOpen(false);
        setActiveImage(null); // Reset active image

        // Restore the other images
        gsap.to(items, {
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        });
      },
    });
  };

  return (
    <div className="container">
      <nav>
        <p>creativeeecapturesss</p>
        <p>showreel</p>
      </nav>

      <div className="gallery">
        {Array.from({ length: 15 }, (_, index) => (
          <div
            key={index}
            className={`item ${isGalleryOpen ? "hidden" : ""}`} // Hide all items when gallery is open
            data-url={`https://example.com/link${index + 1}`}
            data-download={`assets/img/${index + 1}.webp`}
          >
            <img
              src={`/assets/img/${index + 1}.webp`} // Adjust the path for your image folder
              alt={`Item ${index + 1}`}
            />
          </div>
        ))}

        {/* Display the enlarged image in the center */}
        {activeImage && (
          <div className="active-image">
            <img
              src={activeImage.querySelector("img").src}
              alt="Enlarged"
              onClick={closeGallery}
            />
            {/* Icons for Back and Download */}
            <div className="icon-buttons">
              <div className="icon-container back-icon-container">
                <FaArrowLeft className="icon back-icon" onClick={closeGallery} />
                <span className="icon-text">Back</span>
              </div>
              <div className="icon-container download-icon-container">
                <a
                  href={activeImage.getAttribute("data-download")}
                  className="icon download-icon"
                  download
                >
                  <FaArrowDown />
                </a>
                <span className="icon-text">Download</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;

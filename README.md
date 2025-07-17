# Stream Deck Icon Generator

A web-based tool to create custom icons for your Elgato Stream Deck. Design beautiful, personalized icons with custom text, colors, and a wide selection of icons from the Tabler Icons library.

Hosted on [streamdeck.tommerty.com](https://streamdeck.tommerty.com)

![Stream Deck Icon Generator Screenshot](/public/pic.png)

## Features

- **Live Preview**: See your icon update in real-time as you make changes.
- **Icon Customization**:
  - Choose from thousands of icons from the [Tabler Icons](https://tabler-icons.io/) library.
  - Adjust the icon's scale and rotation.
  - Set a custom color for the icon.
- **Text Customization**:
  - Add your own text to the icon.
  - Control text scale.
  - Position the text in one of 9 locations (top-left, top-center, top-right, middle-left, etc.).
  - Set a custom color for the text.
- **Background Color**: Choose any background color to match your style.
- **Download as PNG**: Download your final icon as a 256x256 PNG, ready to be used on your Stream Deck.

## How to Use

1.  **Open the application** in your web browser.
2.  **Use the controls** on the left-hand side to design your icon.
3.  **Select an icon**: Browse or search for an icon.
4.  **Add text**: Enter your desired text.
5.  **Adjust position and scale**: Fine-tune the placement of your icon and text.
6.  **Choose colors**: Pick colors for the icon, text, and background.
7.  **Preview**: The preview on the right will update instantly.
8.  **Download**: Once you're happy with your design, click the "Download Icon" button.

## Tech Stack

- [React Router](https://reactrouter.com)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Tabler Icons](https://tabler-icons.io/) for the icon set.
- [html2canvas](https://html2canvas.hertzen.com/) for generating the downloadable icon image.

## Getting Started

### Installation

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server with HMR:

```bash
pnpm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
pnpm run build
```

## Deployment

This project is configured for deployment on various platforms.

### Coolify Deployment

This project is configured for deployment on [Coolify](https://coolify.io). See [COOLIFY.md](./COOLIFY.md) for details.

### Docker Deployment

To build and run using Docker:

```bash
docker build -t streamdeck-icons .

# Run the container on port 3000 (default)
docker run -p 3000:3000 streamdeck-icons
```

Or use Docker Compose:

```bash
docker compose up -d
```

The containerized application can be deployed to any platform that supports Docker.

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready. Deploy the output of `pnpm run build`.

```
├── package.json
├── pnpm-lock.yaml
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Contributing

Contributions are welcome! If you have ideas for new features or improvements, feel free to open an issue or submit a pull request.

## License

This project is open source. Please add a license file to define the terms under which it is shared.

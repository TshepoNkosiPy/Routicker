# Rou-Ticker Premium 🎯

A beautiful, interactive web application for building and tracking habits with an elegant particle animation background and intelligent habit intelligence features.

## 🌟 Features

- **Habit Tracking**: Add and track up to 2 habits simultaneously with daily check-ins
- **Interactive Particle Animation**: Magnetic cursor-responsive particle system with sky blue accents
- **Dark/Light Mode**: Toggle between themes with persistent local storage
- **Progress Intelligence**: Real-time progress bars, completion percentages, and status indicators
- **Dynamic Motivation**: Personalized motivational messages based on your habit progress
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Beautiful UI**: Premium design with Playfair Display and Inter typography

## 🚀 Live Demo

Access the live application on GitHub Pages:
**[Rou-Ticker Premium](https://TshepoNkosiPy.github.io/Routicker/routicker_premium.html)**

## 📋 Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/TshepoNkosiPy/Routicker.git
   cd Routicker
   ```

2. Start a local HTTP server:
   ```bash
   python -m http.server 8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000/routicker_premium.html
   ```

## 📁 Project Structure

```
rou-ticker/
├── routicker_premium.html    # Main HTML markup
├── routicker_premium.css     # Styling (light & dark modes)
├── routicker_premium.js      # Application logic & animations
├── .vscode/
│   └── launch.json          # VS Code debugging config
└── README.md                # This file
```

## 🎨 Design Highlights

- **Color Palette**: Sky blue (#378ADD, #56b3e8) primary accents
- **Light Mode**: Clean white background with dark text
- **Dark Mode**: Dark background with bright accents
- **Smooth Animations**: Particle system with physics-based movement
- **Magnetic Interaction**: Particles respond to mouse hover

## ⚙️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser LocalStorage for theme preference
- **Graphics**: Canvas 2D API for particle animations
- **Fonts**: Google Fonts (Playfair Display, Inter)
- **Deployment**: GitHub Pages

## 🎮 How to Use

1. **Add a Habit**: Enter a habit name and press Enter (max 2 habits)
2. **Mark Complete**: Check the daily checkbox when you complete the habit
3. **Track Progress**: View your 7-day completion history
4. **View Intelligence**: See progress analysis in the right panel
5. **Toggle Theme**: Click the moon/sun icon to switch dark/light mode
6. **Remove Habit**: Hover over a card and click the × button

## 📊 Habit Status

- **ON TRACK**: Habit completion ≥ 50%
- **FOCUS HERE**: Habit completion < 50% (needs attention)

## 🎯 Sample Data

Pre-loaded with two example habits:
- **Morning Run** (57% complete - ON TRACK)
- **Read 20 Pages** (29% complete - FOCUS HERE)

Delete these and add your own habits to get started!

## 💾 Data Persistence

- Theme preference saved to LocalStorage
- Habits are stored in memory (refresh resets to sample data)
- To persist habits permanently, consider adding backend storage

## 🌐 Browser Support

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Any modern browser with ES6+ and Canvas support

## 🔮 Future Enhancements

- Backend integration for data persistence
- Export/import habits as JSON
- Sharing habit tracking progress
- Multiple habit categories
- Habit reminders and notifications
- Calendar view
- Statistics and insights dashboard

## 👨‍💻 Development

### File Descriptions

**routicker_premium.html**
- Main application markup with canvas animation
- Header with theme toggle
- Habit cards grid layout
- Progress intelligence sidebar

**routicker_premium.css**
- Complete styling for light and dark modes (175 lines)
- Responsive grid layout
- Smooth animations and transitions
- Theme-aware colors and opacity

**routicker_premium.js**
- Particle system with physics simulation (100+ lines)
- Habit CRUD operations
- Dynamic motivational messaging
- Theme management with localStorage
- Mouse interaction handlers

## 📝 License

This project is open source and available for personal and educational use.

## 🙌 Contributing

Feel free to fork this repository and submit pull requests for any improvements!

## 📧 Contact

For questions or suggestions about Rou-Ticker Premium, please open an issue on GitHub.

---

**Built with ❤️ for habit building and personal growth**

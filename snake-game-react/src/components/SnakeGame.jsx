import React, { useState, useEffect, useCallback } from 'react'
import './SnakeGame.css'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_FOOD = { x: 15, y: 15 }
const INITIAL_DIRECTION = 'RIGHT'
const GAME_SPEED = 150

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState(INITIAL_FOOD)
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
    return newFood
  }, [])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection(INITIAL_DIRECTION)
    setIsGameOver(false)
    setScore(0)
  }

  const checkCollision = (head) => {
    // Wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true
      }
    }

    return false
  }

  const moveSnake = useCallback(() => {
    if (isGameOver) return

    const head = { ...snake[0] }
    switch (direction) {
      case 'UP':
        head.y -= 1
        break
      case 'DOWN':
        head.y += 1
        break
      case 'LEFT':
        head.x -= 1
        break
      case 'RIGHT':
        head.x += 1
        break
      default:
        break
    }

    if (checkCollision(head)) {
      setIsGameOver(true)
      return
    }

    const newSnake = [head, ...snake]
    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood())
      setScore(score + 1)
    } else {
      newSnake.pop()
    }

    setSnake(newSnake)
  }, [snake, direction, food, isGameOver, score, generateFood])

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP')
          break
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN')
          break
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT')
          break
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT')
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [direction])

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED)
    return () => clearInterval(gameInterval)
  }, [moveSnake])

  return (
    <div className="game-container">
      <div className="game-info">
        <span>Score: {score}</span>
        {isGameOver && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <button onClick={resetGame}>Play Again</button>
          </div>
        )}
      </div>
      <div 
        className="game-board"
        style={{
          width: GRID_SIZE * CELL_SIZE + 'px',
          height: GRID_SIZE * CELL_SIZE + 'px'
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="snake-segment"
            style={{
              left: segment.x * CELL_SIZE + 'px',
              top: segment.y * CELL_SIZE + 'px',
              width: CELL_SIZE + 'px',
              height: CELL_SIZE + 'px'
            }}
          />
        ))}
        <div
          className="food"
          style={{
            left: food.x * CELL_SIZE + 'px',
            top: food.y * CELL_SIZE + 'px',
            width: CELL_SIZE + 'px',
            height: CELL_SIZE + 'px'
          }}
        />
      </div>
    </div>
  )
}

export default SnakeGame
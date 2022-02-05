import type {NextPage} from 'next'
import {
  Grid,
  gridArea,
  GridItem,
  gridTemplateAreasBuilder,
  GridTrackTemplate,
  gridTrackTemplateBuilder,
  useGridCell,
  useWindowDimensions,
  withFraction,
  withGridTrack,
  withPixels
} from "react-resizable-grid-layout";
import {useLayoutEffect, useRef, useState} from "react";

const Home: NextPage = () => {
  const [showLast, setShowLast] = useState<boolean>(true)

  function createNestedGridTemplateColumn(showLast: boolean): GridTrackTemplate {
    return gridTrackTemplateBuilder()
        .repeatFor(showLast ? 3 : 2, withGridTrack(withFraction(1), 'last one'))
        .build()
  }

  return (
      <Grid
          dimensionsSupplier={useWindowDimensions}
          gridTemplateColumns={gridTrackTemplateBuilder()
              .addTrack(withPixels(150))
              .addTrack(withFraction(1))
              .addTrack(withPixels(100))
              .build()
          }
          gridTemplateRows={gridTrackTemplateBuilder()
              .addTrack(withPixels(65))
              .addTrack(withFraction(1))
              .addTrack(withPixels(40))
              .build()
          }
          gridTemplateAreas={gridTemplateAreasBuilder()
              .addArea('header', gridArea(1, 1, 1, 3))
              .addArea('sidebar', gridArea(2, 1))
              .addArea('main', gridArea(2, 2))
              .addArea('aside', gridArea(2, 3))
              .addArea('footer', gridArea(3, 1, 1, 3))
              .build()
          }
          rowGap={5}
          columnGap={5}
          showGrid={false}
      >
        <GridItem gridAreaName='header'>
          <CellContents/>
        </GridItem>
        <GridItem gridAreaName='sidebar'>
          <CellContents/>
        </GridItem>
        <GridItem gridAreaName='main'>
          <Grid
              dimensionsSupplier={useGridCell}
              gridTemplateColumns={createNestedGridTemplateColumn(showLast)}
              columnGap={1}
              rowGap={1}
          >
            <GridItem column={1} row={1}>
              <CellContents/>
            </GridItem>
            <GridItem column={1} row={2}>
              <CellContents/>
            </GridItem>
            <GridItem column={3} row={3} isVisible={showLast}>
              <CellContents showRemoveButton={true} onRemoveButtonClick={() => setShowLast(false)}/>
            </GridItem>
            <GridItem column={1} row={4}>
              <CellContents/>
            </GridItem>
            <GridItem column={2} row={1} rowsSpanned={4}>
              <CellContents/>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem gridAreaName='aside'>
          <CellContents/>
        </GridItem>
        <GridItem gridAreaName='footer'>
          <CellContents/>
        </GridItem>
      </Grid>
  )
}

function noop() {
  /* empty */
}

function removeButton(onClick: () => void): JSX.Element {
  return (
      <div style={{display: 'flex', justifyContent: 'space-around'}}>
        <button onClick={onClick}>Remove</button>
      </div>
  )
}

interface CellContentsProps {
  showRemoveButton?: boolean
  onRemoveButtonClick?: () => void
}

function CellContents(props: CellContentsProps): JSX.Element {
  const {showRemoveButton = false, onRemoveButtonClick = noop} = props
  const {width, height, row, column, rowsSpanned, columnsSpanned} = useGridCell()
  if (width > 130) {
    return (
        <div style={{height}}>
          <div style={{backgroundColor: 'lightgrey', height: '100%'}}>
            <div>
              <span>{row}, {column}</span>
              <span style={{fontSize: '0.7em', color: 'grey', marginLeft: 7}}>{width} x {height}</span>
              <span style={{
                fontSize: '0.7em',
                color: 'grey',
                marginLeft: 7
              }}>({rowsSpanned} x {columnsSpanned})</span>
            </div>
            <Canvas width={width - 20} height={height / 3}/>
            {showRemoveButton ? removeButton(onRemoveButtonClick) : <span/>}
          </div>
        </div>
    )
  }
  return (
      <div style={{height}}>
        <div style={{backgroundColor: 'lightgrey', height: '100%'}}>
          <div>{row}, {column}</div>
          <div style={{fontSize: '0.7em', color: 'grey'}}>{width} x {height}</div>
          <div style={{fontSize: '0.7em', color: 'grey'}}>({rowsSpanned} x {columnsSpanned})</div>
          <Canvas width={width / 2} height={height / 3}/>
          {showRemoveButton ? removeButton(onRemoveButtonClick) : <span/>}
        </div>
      </div>
  )
}

interface CanvasProps {
  width: number
  height: number
}


function Canvas(props: CanvasProps): JSX.Element {
  const {width, height} = props;
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(
      () => {
        if (canvasRef.current !== null) {
          const context = canvasRef.current.getContext('2d')
          if (context) {
            context.fillStyle = `rgb(${width % 255}, ${height % 255}, 100)`
            context.rect(10, 10, width - 10, height - 10)
            context.fill()
          }
        }
      },
      [width, height]
  )

  return <canvas ref={canvasRef} width={width} height={height}/>
}

export default Home

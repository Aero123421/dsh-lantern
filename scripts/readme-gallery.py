"""Prints the README gallery table for one language: python3 scripts/readme-gallery.py en|ja|zh"""
import sys

ITEMS = [
    ('molecule', 'inline', 'three.js',
     ('Molecule viewer', 'Drag to rotate, click atoms to measure bond lengths and angles, switch ball-and-stick / space-filling. Six molecules up to C₆₀.'),
     ('分子ビューア', 'ドラッグで回転、原子をクリックして結合距離や角度を測定。球棒・空間充填を切り替え。水から C₆₀ まで 6 種類。'),
     ('分子查看器', '拖动旋转，点击原子测量键长和键角，切换球棍/空间填充。从水到 C₆₀ 共 6 种分子。')),
    ('surface', 'panel', 'three.js · KaTeX',
     ('3D function surface', 'Five functions with live formulas. Hover for the tangent plane and gradient, click to run gradient descent from that point.'),
     ('3D 関数サーフェス', '数式つきの 5 種類の曲面。カーソル位置の接平面と勾配を表示し、クリックした点から勾配降下を実行。'),
     ('三维函数曲面', '5 个带公式的曲面。悬停显示切平面和梯度，点击即从该点开始梯度下降。')),
    ('solar', 'panel', 'three.js',
     ('Orrery', 'Planets placed from real orbital elements. Scrub the date, play at any speed, click a planet to follow it.'),
     ('太陽系オーラリー', '実際の軌道要素から惑星を配置。日付スライダー、再生速度、惑星をクリックして追尾。'),
     ('太阳系仪', '按真实轨道根数摆放行星。拖动日期、任意速度播放，点击行星即可跟随。')),
    ('graph', 'inline', 'D3',
     ('Concept map', 'Force-directed graph of ML concepts: drag to pin, search, filter, zoom. "Explain this concept" asks the agent.'),
     ('概念マップ', '機械学習の概念をつないだ力学グラフ。ドラッグで固定、検索、絞り込み、ズーム。「この概念を説明」でエージェントに質問。'),
     ('概念图谱', '机器学习概念的力导向图：拖动固定、搜索、筛选、缩放。“解释这个概念”直接向智能体提问。')),
    ('pendulum', 'inline', 'canvas',
     ('Double pendulum', 'Drag the bobs to set the start. Three copies 0.001 rad apart drift into chaos, with a log-scale divergence chart.'),
     ('二重振り子とカオス', 'おもりをドラッグして初期位置を決める。0.001 rad だけ違う 3 つの振り子が別々の動きへ。ずれは対数グラフで。'),
     ('双摆与混沌', '拖动摆锤设定初始位置。相差 0.001 rad 的三个摆逐渐分道扬镳，并附对数发散曲线。')),
    ('pathfind', 'inline', 'canvas',
     ('Pathfinding', 'Draw walls and mud, then play, step or race BFS, Dijkstra, A* and greedy search. Includes a maze generator.'),
     ('経路探索', '壁やぬかるみを描いて、BFS・ダイクストラ・A*・貪欲法を再生、コマ送り、一斉比較。迷路の自動生成つき。'),
     ('寻路算法', '绘制墙和泥地，播放、单步或同时比较 BFS、Dijkstra、A* 与贪心搜索。附带迷宫生成。')),
    ('explorer', 'panel', 'D3',
     ('Linked dashboard', 'Brush the timeline or the scatter plot, click bars — every chart filters every other one.'),
     ('連動ダッシュボード', 'タイムラインや散布図をブラシで範囲選択、棒をクリック。すべてのグラフが互いに絞り込み合う。'),
     ('联动仪表盘', '在时间轴或散点图上刷选、点击柱形，所有图表相互联动筛选。')),
    ('matrix', 'inline', 'KaTeX',
     ('Matrix explorer', 'Drag the basis vectors and watch the matrix, determinant and eigenvectors update live.'),
     ('2×2 行列と線形変換', '基底ベクトルをドラッグすると、行列・行列式・固有ベクトルがその場で更新。'),
     ('2×2 矩阵与线性变换', '拖动基向量，矩阵、行列式和特征向量实时更新。')),
    ('hanoi', 'inline', 'DOM',
     ('Tower of Hanoi', 'Drag and drop the discs, or let auto-solve show the recursion move by move.'),
     ('ハノイの塔', '円盤をドラッグ＆ドロップで移動。「自動で解く」で再帰の手順をアニメーション。'),
     ('汉诺塔', '拖放圆盘，或让自动求解一步步演示递归。')),
    ('ranking', 'inline', 'await_response',
     ('Drag-to-rank answer', 'Sort the backlog against a capacity line. The final order returns to the agent as the tool result.'),
     ('ドラッグで優先順位', '容量ラインを見ながら並べ替え。決めた順番がツール結果としてエージェントに戻る。'),
     ('拖动排序作答', '对照容量线排列待办事项，最终顺序作为工具结果返回给智能体。')),
    ('shader', 'inline', 'WebGL2',
     ('Generative shader', 'A flowing GPU pattern that swirls under the cursor and ripples on click. Switch palettes, save a PNG.'),
     ('流れる模様', 'カーソルで渦、クリックで波紋が広がる GPU シェーダー。配色を切り替えて PNG で保存。'),
     ('流动纹理', 'GPU 着色器图案，光标处产生漩涡，点击泛起涟漪。切换配色并保存 PNG。')),
]

lang = sys.argv[1] if len(sys.argv) > 1 else 'en'
index = {'en': 0, 'ja': 1, 'zh': 2}[lang]
place = {'en': {'inline': 'in the chat', 'panel': 'in the sidebar'},
         'ja': {'inline': 'チャット内', 'panel': 'サイドバー'},
         'zh': {'inline': '对话内', 'panel': '侧边栏'}}[lang]

cells = []
for name, where, tech, *texts in ITEMS:
    title, body = texts[index]
    cells.append(
        f'<td width="50%" valign="top">\n'
        f'<a href="examples/{name}.html"><picture><source media="(prefers-color-scheme: dark)" srcset="docs/gallery/{name}-dark.jpg">'
        f'<img src="docs/gallery/{name}-light.jpg" alt="{title}" width="100%"></picture></a><br>\n'
        f'<b>{title}</b> <sub>{tech} · {place[where]}</sub><br>\n'
        f'<sub>{body}</sub>\n</td>')
rows = ['<tr>\n' + '\n'.join(cells[i:i + 2]) + '\n</tr>' for i in range(0, len(cells), 2)]
print('<table>\n' + '\n'.join(rows) + '\n</table>')

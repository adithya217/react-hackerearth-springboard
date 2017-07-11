
// Wrapping all code into an anonymous function to prevent leaking into window/global scope
(function(){
	
	(function(){
		// custom enum for these values
		var E_SORT_BY = {
			VOTES_UP : '1',
			VOTES_DOWN : '2',
			LEARNERS : '3',
			DURATION : '4'
		}
		
		window.getSortByEnum = function(){
			return E_SORT_BY;
		};
		
		window.getUpvoteCount = function(name){
			if(!localStorage){return 0;}
			
			var dataItem = localStorage.getItem(name);
			dataItem = dataItem ? JSON.parse(dataItem) : {};
			
			return parseInt(dataItem.uvc || 0);
		}
		
		window.getDownvoteCount = function(name){
			if(!localStorage){return 0;}
			
			var dataItem = localStorage.getItem(name);
			dataItem = dataItem ? JSON.parse(dataItem) : {};
			
			return parseInt(dataItem.dvc || 0);
		}
	})();

	var SortBySection = React.createClass({
		getInitialState : function(){
			return {
				sortBy : window.getSortByEnum().VOTES_UP,
				totalUpvotes : 0
			};
		},
		componentWillMount : function(){
			// set the total upvote count
			var tuvcItemKey = 'tuvc';
			var tuvc = localStorage.getItem(tuvcItemKey);
			tuvc = parseInt(tuvc || 0);
			this.setState({
				totalUpvotes : tuvc
			});
			
			document.addEventListener('totalUpvotesChanged', this.onTotalUpvotesChanged, false);
		},
		componentWillUnmount : function(){
			document.removeEventListener('totalUpvotesChanged', this.onTotalUpvotesChanged, false);
		},
		onTotalUpvotesChanged : function(e){
			this.setState({
				totalUpvotes : e.detail
			});
		},
		onSelectionChanged : function(e){
			var newSortBy = e.currentTarget.value;
			
			this.setState({
				sortBy : newSortBy
			});
			
			var sortByChangedEvent = new CustomEvent('sortByChanged', { 'detail' : newSortBy });
			document.dispatchEvent(sortByChangedEvent);
		},
		render : function(){
			return (
				<div id="sb-wrapper" className="sb-wrapper">
					<div className="sb-container">
						<div className="sb-title-wrapper">
							<i className="sb-icon fa fa-sort"></i>
							<span className="sb-text">Sort by</span>
						</div>
						<div className="sb-options-wrapper">
							<div className="sb-option-wrapper">
								<input className="sb-option" type="radio" name="sortBy" value={window.getSortByEnum().VOTES_UP} checked={this.state.sortBy === window.getSortByEnum().VOTES_UP} onChange={this.onSelectionChanged} />
								<span className="sb-label">Vote (Up)</span>
							</div>
							<div className="sb-option-wrapper">
								<input className="sb-option" type="radio" name="sortBy" value={window.getSortByEnum().VOTES_DOWN} checked={this.state.sortBy === window.getSortByEnum().VOTES_DOWN} onChange={this.onSelectionChanged} /> 
								<span className="sb-label">Vote (Down)</span>
							</div>
							<div className="sb-option-wrapper">
								<input className="sb-option" type="radio" name="sortBy" value={window.getSortByEnum().LEARNERS} checked={this.state.sortBy === window.getSortByEnum().LEARNERS} onChange={this.onSelectionChanged} />
								<span className="sb-label">Learners</span>
							</div>
							<div className="sb-option-wrapper">
								<input className="sb-option" type="radio" name="sortBy" value={window.getSortByEnum().DURATION} checked={this.state.sortBy === window.getSortByEnum().DURATION} onChange={this.onSelectionChanged} />
								<span className="sb-label">Duration</span>
							</div>
						</div>
						<div className="sb-tup-wrapper">
							<span className="sb-tup-text">Total Upvotes:</span>
							<span className="sb-tup-count">{this.state.totalUpvotes}</span>
						</div>
					</div>
				</div>
			);
		}
	});
	
	var SearchSuggestions = React.createClass({
		getInitialState : function(){
			return {};
		},
		getSuggestions : function(query){
			var suggestions = [];
			
			this.props.tags.forEach(function(tag){
				if(tag.startsWith(query)){
					suggestions.push(tag);
				}
			});
			
			return suggestions;
		},
		onSuggestionClicked : function(suggestion){
			var suggestionClickedEvent = new CustomEvent('suggestionClicked', { 'detail' : suggestion });
			document.dispatchEvent(suggestionClickedEvent);
		},
		render : function(){
			var suggestions = this.getSuggestions(this.props.query);
			
			var suggestionsStyle;
			if(this.props.query === '' || !suggestions.length){
				suggestionsStyle = { display : 'none'};
			}
			
			var componentScope = this;
			
			return (
				<ul id="ss-wrapper" className="ss-wrapper" style={suggestionsStyle}>
				{
					suggestions.map(function(tag){
						return (
							<li className="suggestion" onClick={() => componentScope.onSuggestionClicked(tag)}>{tag}</li>
						);
					})
				}
				</ul>
			);
		}
	});
	
	var SearchByTag = React.createClass({
		getInitialState : function(){
			return {
				inputText : '',
				clearIconVisible : false,
				tags : []
			};
		},
		componentWillMount : function(){
			this.computeTags();
		},
		componentWillUnmount : function(){
		},
		computeTags : function(){
			var tagsList = [];
			
			this.props.items.forEach(function(item){
				if(!item.tags){ return;}
				
				var itemTags = item.tags.split(',');
				
				itemTags.forEach(function(tag){
					var cleanedTag = tag.trim();
					if(cleanedTag === ''){return;}
					
					tagsList.push(cleanedTag); 
				});
			});
			
			this.setState({
				tags : tagsList
			});
		},
		onInputChange : function(e){
			this.setState({
				inputText : e.currentTarget.value,
				clearIconVisible : true
			});
		},
		onCloseClick : function(e){
			this.setState(this.getInitialState());
		},
		render : function(){
			var clearIconStyle;
			if(!this.state.clearIconVisible){
				clearIconStyle = { display : 'none'};
			}
			
			return (
				<div id="search-wrapper" className="search-wrapper">
					<div className="search-container">
						<div className="searchbox">
							<i className="sbt-search-icon fa fa-search"></i>
							<input type="text" name="searchByTag" className="sbt-input" placeholder="Search (by tag)" value={this.state.inputText} onChange={this.onInputChange}/>
							<i className="sbt-clear-icon fa fa-close" style={clearIconStyle} onClick={this.onCloseClick}></i>
						</div>
						<SearchSuggestions tags={this.state.tags} query={this.state.inputText}/>
					</div>
				</div>
			);
		}
	});
	
	var DataContentItem = React.createClass({
		getInitialState : function(){
			return {
				uvc : 0,
				dvc : 0
			};
		},
		componentWillMount : function(){
			var itemKey = this.props.data.name;
			var dataItem = localStorage.getItem(itemKey);
			dataItem = dataItem ? JSON.parse(dataItem) : {};
			
			var uvc = parseInt(dataItem.uvc || 0);
			var dvc = parseInt(dataItem.dvc || 0);
			this.setState({
				uvc : uvc,
				dvc : dvc
			});
		},
		onUpvoteClicked : function(e){
			if(window.localStorage){
				// set the upvote count
				var itemKey = this.props.data.name;
				var dataItem = localStorage.getItem(itemKey);
				dataItem = dataItem ? JSON.parse(dataItem) : {};
				
				var upvoteCount = parseInt(dataItem.uvc || 0);
				upvoteCount++;
				
				dataItem.uvc = upvoteCount;
				localStorage.setItem(itemKey, JSON.stringify(dataItem));
				
				// set the total upvote count
				var tuvcItemKey = 'tuvc';
				var tuvc = localStorage.getItem(tuvcItemKey);
				tuvc = parseInt(tuvc || 0);
				tuvc++;
				localStorage.setItem(tuvcItemKey, tuvc);
				
				var totalUpvotesChangedEvent = new CustomEvent('totalUpvotesChanged', { 'detail' : tuvc});
				document.dispatchEvent(totalUpvotesChangedEvent);
				
				this.setState({ uvc : upvoteCount});
			}
		},
		onDownvoteClicked : function(e){
			if(window.localStorage){
				// set the downvote count
				var itemKey = this.props.data.name;
				var dataItem = localStorage.getItem(itemKey);
				dataItem = dataItem ? JSON.parse(dataItem) : {};
				
				var downvoteCount = parseInt(dataItem.dvc || 0);
				downvoteCount++;
				
				dataItem.dvc = downvoteCount;
				localStorage.setItem(itemKey, JSON.stringify(dataItem));
				
				// set the total downvote count
				var tdvcItemKey = 'tdvc';
				var tdvc = localStorage.getItem(tdvcItemKey);
				tdvc = parseInt(tdvc || 0);
				localStorage.setItem(tdvcItemKey, tdvc + 1);
				
				this.setState({ dvc : downvoteCount});
			}
		},
		render : function(){
			return (
				<div className="data-item">
					<div className="item-content-row data-row">
						<div className="item-content-column image-column">
							<div className="image-wrapper">
								<img className="image" src={this.props.data.image} />
							</div>
						</div>
						
						<div className="item-content-column data-column">
							<div className="item-content-wrapper">
								<div className="item-title-wrapper">
									<h5 className="item-title">{this.props.data.name}</h5>
								</div>
								<div className="item-tags-wrapper">
									<i className="item-tags-icon fa fa-tags"></i>
									<span className="item-tags">{this.props.data.tags}</span>
								</div>
								<div className="item-metainfo-wrapper">
									<div className="item-metainfo-row">
										<div className="item-metainfo-column uvdv-column">
											<div className="item-mi-data-wrapper uv-wrapper">
												<span className="item-uv-icon no-select" onClick={this.onUpvoteClicked}>&#9650;</span>
												<span className="item-uv-count no-select">{this.state.uvc}</span>
											</div>
											<div className="item-mi-data-wrapper dv-wrapper">
												<span className="item-dv-icon no-select"  onClick={this.onDownvoteClicked}>&#9660;</span>
												<span className="item-dv-count no-select">{this.state.dvc}</span>
											</div>
										</div>
										<div className="item-metainfo-column break-column"></div>
										<div className="item-metainfo-column ld-column">
											<div className="item-mi-data-wrapper learners-wrapper">
												<i className="item-learners-icon no-select fa fa-user"></i>
												<span className="item-learners-text no-select">{this.props.data.learner} Learners</span>
											</div>
											<div className="item-mi-data-wrapper duration-wrapper">
												<i className="item-hours-icon no-select fa fa-clock-o"></i>
												<span className="item-hours-text no-select">{this.props.data.hours} Hours</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div className="item-content-row description-row">
						<div className="item-description-wrapper">
							<span className="item-description-label">Description:</span>
							<div className="item-description">{this.props.data.description}</div>
						</div>
					</div>
					
					<div className="item-content-row link-row">
						<div className="item-cv-link-wrapper">
							<a className="item-cv-link" href={this.props.data.sign_up} target="_blank">
								<div className="item-cv-link-styler">
									<i className="item-cv-link-icon fa fa-link"></i>
									<span className="item-cv-link-text">View Curriculum</span>
								</div>
							</a>
						</div>
					</div>
				</div>
			);
		}
	});
	
	var DataContentSection = React.createClass({
		getInitialState : function(){
			return {
				sortBy : window.getSortByEnum().VOTES_UP,
				items : []
			};
		},
		componentWillMount : function(){
			this.setState({items : this.props.items});
			
			document.addEventListener('sortByChanged', this.onSortByChanged, false);
		},
		componentWillUnmount : function(){
			document.removeEventListener('sortByChanged', this.onSortByChanged, false);
		},
		onSortByChanged : function(e){
			this.setState({
				sortBy : e.detail
			});
		},
		createComparator : function(keyName){
			var SORT_BY_ENUM = window.getSortByEnum();
			switch(keyName){
				case SORT_BY_ENUM.VOTES_UP:
					return function(a,b){
						var aUVC = window.getUpvoteCount(a.name);
						var bUVC = window.getUpvoteCount(b.name);
						return aUVC - bUVC;
					};
				case SORT_BY_ENUM.VOTES_DOWN:
					return function(a,b){
						var aDVC = window.getDownvoteCount(a.name);
						var bDVC = window.getDownvoteCount(b.name);
						return aDVC - bDVC;
					}
				case SORT_BY_ENUM.LEARNERS:
					return function(a,b){
						var aLearners = a.learner ? a.learner.replace(new RegExp(',', 'g'),'') : 0;
						aLearners = parseInt(aLearners || 0);
						
						var bLearners = b.learner ? b.learner.replace(new RegExp(',', 'g'),'') : 0;
						bLearners = parseInt(bLearners || 0);
						
						return aLearners - bLearners;
					};
				case SORT_BY_ENUM.DURATION:
					return function(a,b){
						var aDuration = a.hours ? a.hours.replace('+','') : 0;
						aDuration = parseInt(aDuration || 0);
						
						var bDuration = b.hours ? b.hours.replace('+','') : 0;
						bDuration = parseInt(bDuration || 0);
						
						return aDuration - bDuration;
					};
				default:
					return function(a,b){
						var aId = parseInt(a.id || 0)
						var bId = parseInt(b.id || 0);
						
						return aId - bId;
					};
			};
		},
		sortArray : function(items, sortOnKey){
			return items.sort(this.createComparator(sortOnKey));
		},
		render : function(){
			var items = this.sortArray(this.state.items, this.state.sortBy);
			
			return (
				<div className="data-content-wrapper">
					<div className="results-text-wrapper">
						<i className="results-icon fa fa-database"></i>
						<span className="results-text-wrapper">
							<span className="rt-1">Results:&nbsp;</span>
							<span className="results-count">{items.length}</span>
							<span className="rt-2">&nbsp;courses found.</span>
						</span>
					</div>
					<div className="data-items-wrapper">
						{
							items.map(function(item){
								return (<DataContentItem key={item.name} data={item} />);
							})
						}
					</div>
				</div>
			);
		}
	});


	var MainContentSection = React.createClass({
		render : function(){
			return (
				<div id="mc-wrapper" className="mc-wrapper">
					<SearchByTag items={this.props.data.paths} />
					<DataContentSection items={this.props.data.paths} />
				</div>
			);
		}
	});


	var TagSelectionSection = React.createClass({
		render : function(){
			return (
				<div id="cs-wrapper" className="cs-wrapper">
				</div>
			);
		}
	});


	var InterfaceContainer = React.createClass({
		render : function(){
			return (
				<div id="interface-container" className="interface-container">
					<SortBySection />
					<MainContentSection data={this.props.data}/>
					<TagSelectionSection data={this.props.data} />
				</div>
			);
		}
	});


	function loadUI(data){
		ReactDOM.render(<InterfaceContainer data={data} />, document.getElementById('interface-wrapper'));
	}

	function getDataAndLoadInterface(){
		var request = new XMLHttpRequest();
		
		request.addEventListener('load', function(){
			var data = JSON.parse(this.responseText);
			loadUI(data);
		});
		
		request.open('GET', '/data');
		request.send();
	}


	getDataAndLoadInterface();

})();












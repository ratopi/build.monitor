const jsoner = ( data ) => data.json();

const BuildListItem = React.createClass(
	{
		getInitialState: function ()
		{
			return {
				"parameters": null,
				"build": null
			};
		},

		"componentDidMount": function ()
		{
			setTimeout( () => this.query(), 0 );
		},

		"query": function ()
		{
			const self = this;

			const handler =
				function ( data )
				{
					self.setState(
						{
							"build": data
						}
					);

					if ( data.actions )
					{
						data.actions.forEach(
							function ( action )
							{
								var parameters;
								if ( action.parameters )
								{
									parameters = {};
									action.parameters.forEach(
										function ( p )
										{
											parameters[ p.name ] = p.value;
										}
									);

									self.setState(
										{
											"parameters": parameters
										}
									);
								}
							}
						);
					}
				};

			fetch( this.props.build.url + "api/json" ).then( jsoner ).then( handler );
		},

		"render": function ()
		{
			if ( this.state.build )
			{
				const parameterString = this.state.parameters ? JSON.stringify( this.state.parameters ) : "";
				const time = new Date(this.state.build.timestamp ).toISOString();
				return (
					<li>{this.props.build.number} {time} {this.state.build.result} {parameterString}</li>
				);
			}
			else
			{
				return (
					<li>{this.props.build.number}</li>
				);
			}
		}
	}
);

const BuildList = function ( props )
{
	if ( ! props.builds ) return (
		<span>loading...</span>
	);

	const listItems = props.builds.map(
		( build ) => <BuildListItem build={build} key={build.number.toString()}/>
	);

	return (
		<ul>
			{listItems}
		</ul>
	);
};


const JobState = React.createClass(
	{
		getInitialState: function ()
		{
			return {
				"job": null
			};
		},

		"componentDidMount": function ()
		{
			setTimeout( () => this.query(), 0 );
		},

		"query": function ()
		{
			const self = this;

			const handler =
				function ( data )
				{
					self.setState(
						{
							"job": data
						}
					);
				};

			fetch( "/job/" + this.props.jobName + "/api/json" ).then( jsoner ).then( handler );
		},

		"render": function ()
		{
			return (
				<span>
					<h3>{this.props.jobName}</h3>
					{ this.state.job && <BuildList builds={this.state.job.builds}/> }
				</span>
			);
		}
	}
);


const JobListItem = React.createClass(
	{
		"handleClick": function ()
		{
			this.props.selectJob( this.props.job );
		},

		"render": function ()
		{
			const style = {
				"color": this.props.job.color
			};

			const link = "/job/" + this.props.job.name + "/api/json";

			return (
				<li>
					<span style={style}>### </span>
					<span onClick={this.handleClick}>
						{this.props.job.name}
					</span>
				</li>
			);
		}
	}
);


const JobList = function ( props )
{
	const listItems = props.jobs.map(
		( job ) => <JobListItem job={job} key={job.name} selectJob={props.selectJob}/>
	);

	return (
		<ul>
			{listItems}
		</ul>
	);
};


const BuildMonitor = React.createClass(
	{
		getInitialState: function ()
		{
			return {
				"jobs": [],
				"job": null
			};
		},

		componentDidMount: function ()
		{
			setTimeout( () => this.updateJobs(), 0 );
			this.timerID = setInterval( () => this.updateJobs(), 60000 );
		},

		componentWillUnmount: function ()
		{
			clearInterval( this.timerID );
		},

		updateJobs: function ()
		{
			const self = this;

			const handler =
				function ( data )
				{
					self.setState(
						{
							"jobs": data.jobs
						}
					)
				};

			fetch( "/api/json" ).then( jsoner ).then( handler );
		},

		clearJob: function ()
		{
			this.setState( { "job": null } );
		},

		selectJob: function ( job )
		{
			this.setState( { "job": job } );
		},

		render()
		{
			return (
				<div>
					<h1 onClick={this.clearJob}>Build Monitor</h1>
					{ this.state.job ? (
						<JobState jobName={this.state.job.name}/>
					) : (
						<JobList jobs={this.state.jobs} selectJob={this.selectJob}/>
					) }
				</div>
			);
		}
	} );


ReactDOM.render(
	<BuildMonitor />,
	document.getElementById( "root" )
);
